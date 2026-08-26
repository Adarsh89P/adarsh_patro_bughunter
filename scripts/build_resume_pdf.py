"""Typeset the resume PDF straight from the .docx, so the wording is the
author's and only the layout is ours. Styled to match the portfolio."""
import sys, re
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm
from reportlab.lib.colors import HexColor
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.enums import TA_JUSTIFY
from reportlab.platypus import (BaseDocTemplate, Frame, PageTemplate, Paragraph,
                                Spacer, Table, TableStyle, ListFlowable, ListItem,
                                HRFlowable, KeepTogether)
from parse_resume import parse

ACCENT = HexColor('#7C3AED')
INK = HexColor('#111019')
MUTED = HexColor('#4A4860')
LINE = HexColor('#DDDAEA')

def esc(t):
    return t.replace('&', '&amp;').replace('<', '&lt;').replace('>', '&gt;')

S = {
    'name': ParagraphStyle('name', fontName='Helvetica-Bold', fontSize=21,
                           leading=24, textColor=INK, spaceAfter=2),
    'role': ParagraphStyle('role', fontName='Helvetica', fontSize=10.5,
                           leading=13, textColor=ACCENT, spaceAfter=4),
    'contact': ParagraphStyle('contact', fontName='Helvetica', fontSize=8.4,
                              leading=12, textColor=MUTED),
    'h2': ParagraphStyle('h2', fontName='Helvetica-Bold', fontSize=9.4,
                         leading=12, textColor=ACCENT, spaceBefore=9,
                         spaceAfter=3),
    'body': ParagraphStyle('body', fontName='Helvetica', fontSize=9,
                           leading=12.6, textColor=MUTED, alignment=TA_JUSTIFY),
    'jobrole': ParagraphStyle('jobrole', fontName='Helvetica-Bold', fontSize=9.8,
                              leading=12.4, textColor=INK),
    'dates': ParagraphStyle('dates', fontName='Helvetica', fontSize=8.4,
                            leading=12.4, textColor=ACCENT, alignment=2),
    'bullet': ParagraphStyle('bullet', fontName='Helvetica', fontSize=8.8,
                             leading=12.2, textColor=MUTED),
    'plain': ParagraphStyle('plain', fontName='Helvetica', fontSize=9,
                            leading=12.6, textColor=MUTED),
}

def rule():
    return HRFlowable(width='100%', thickness=0.6, color=LINE,
                      spaceBefore=1, spaceAfter=5)

def heading(text):
    # Letter-spaced caps, matching the site's section eyebrows. Regular spaces
    # get collapsed by the paragraph parser, so the tracking uses &nbsp;.
    tracked = '&nbsp;'.join('&nbsp;&nbsp;' if c == ' ' else esc(c)
                            for c in text.upper())
    return [Paragraph(tracked, S['h2']), rule()]

def bullets(items):
    return ListFlowable(
        [ListItem(Paragraph(esc(t), S['bullet']), leftIndent=9, value='bulletchar')
         for t in items],
        bulletType='bullet', bulletFontSize=5.5, bulletColor=ACCENT,
        bulletOffsetY=-2.2, leftIndent=8, spaceBefore=1,
    )

def linkify(text):
    """Turn bare domains in the contact line into real links."""
    out = esc(text)
    out = re.sub(r'(?<![\w/@.])((?:linkedin\.com|github\.com)/[^\s|]+)',
                 r'<link href="https://\1" color="#4A4860">\1</link>', out)
    out = re.sub(r'([\w.+-]+@[\w-]+\.[\w.]+)',
                 r'<link href="mailto:\1" color="#4A4860">\1</link>', out)
    return out.replace(' | ', '  <font color="#DDDAEA">|</font>  ')

def build(src, dest):
    d = parse(src)
    doc = BaseDocTemplate(dest, pagesize=A4,
                          leftMargin=16*mm, rightMargin=16*mm,
                          topMargin=14*mm, bottomMargin=13*mm,
                          title=f"{d['name'].title()} — Resume",
                          author=d['name'].title(), subject=d['title'])
    frame = Frame(doc.leftMargin, doc.bottomMargin, doc.width, doc.height, id='body')
    doc.addPageTemplates([PageTemplate(id='page', frames=[frame])])

    story = [
        Paragraph(esc(d['name'].title()), S['name']),
        Paragraph(esc(d['title']), S['role']),
        Paragraph(linkify(d['contact']), S['contact']),
        Spacer(1, 3),
    ]

    story += heading('Professional Summary')
    story.append(Paragraph(esc(d['summary']), S['body']))

    story += heading('Core Skills')
    rows = [[Paragraph(f'<b><font color="#111019">{esc(k)}</font></b>', S['bullet']),
             Paragraph(esc(v), S['bullet'])] for k, v in d['skills']]
    table = Table(rows, colWidths=[42*mm, doc.width - 42*mm], hAlign='LEFT')
    table.setStyle(TableStyle([
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ('LEFTPADDING', (0, 0), (-1, -1), 0),
        ('RIGHTPADDING', (0, 0), (0, -1), 6),
        ('TOPPADDING', (0, 0), (-1, -1), 1.2),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 1.2),
    ]))
    story.append(table)

    story += heading('Professional Experience')
    for i, job in enumerate(d['experience']):
        head = Table(
            [[Paragraph(f"{esc(job['role'])} <font color='#4A4860'>&nbsp;·&nbsp; "
                        f"{esc(job['company'])}</font>", S['jobrole']),
              Paragraph(esc(job['dates']), S['dates'])]],
            colWidths=[doc.width - 34*mm, 34*mm], hAlign='LEFT')
        head.setStyle(TableStyle([
            ('VALIGN', (0, 0), (-1, -1), 'TOP'),
            ('LEFTPADDING', (0, 0), (-1, -1), 0),
            ('RIGHTPADDING', (0, 0), (-1, -1), 0),
            ('TOPPADDING', (0, 0), (-1, -1), 0),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 2),
        ]))
        block = [head, bullets(job['bullets'])]
        if i < len(d['experience']) - 1:
            block.append(Spacer(1, 6))
        # Keep at least the heading with its first bullets.
        story.append(KeepTogether(block) if len(job['bullets']) <= 4 else block[0])
        if len(job['bullets']) > 4:
            story.extend(block[1:])

    story += heading('Projects')
    for i, proj in enumerate(d['projects']):
        story.append(Paragraph(
            f"{esc(proj['name'])} <font size=8 color='#7C3AED'>"
            f"<link href=\"https://{esc(proj['repo'])}\">{esc(proj['repo'])}</link></font>",
            S['jobrole']))
        story.append(Paragraph(esc(proj['summary']), S['bullet']))
        if i < len(d['projects']) - 1:
            story.append(Spacer(1, 5))

    story += heading('Education')
    for line in d['education']:
        story.append(Paragraph(esc(line), S['plain']))

    story += heading('Certifications')
    for line in d['certifications']:
        story.append(Paragraph(esc(line), S['plain']))

    doc.build(story)

if __name__ == '__main__':
    build(sys.argv[1], sys.argv[2])
