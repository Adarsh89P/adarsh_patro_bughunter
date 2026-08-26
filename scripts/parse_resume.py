"""Parse the .docx into a structure so the PDF is typeset from the source text,
never retyped by hand."""
import zipfile, re, html, json, sys

def extract(path):
    xml = zipfile.ZipFile(path).read('word/document.xml').decode('utf-8')
    xml = re.sub(r'</w:p>', '\n', xml)
    xml = re.sub(r'<w:tab[^>]*/>', '\t', xml)
    xml = re.sub(r'<w:br[^>]*/>', '\n', xml)
    return [html.unescape(re.sub(r'<[^>]+>', '', l)).rstrip()
            for l in xml.split('\n')]

SECTIONS = ['PROFESSIONAL SUMMARY', 'CORE SKILLS', 'PROFESSIONAL EXPERIENCE',
            'PROJECTS', 'EDUCATION', 'CERTIFICATIONS']

def parse(path):
    lines = [l for l in extract(path) if l.strip()]
    doc = {'name': lines[0], 'title': lines[1], 'contact': lines[2], 'sections': {}}
    current, buf = None, []
    for line in lines[3:]:
        if line.strip() in SECTIONS:
            if current:
                doc['sections'][current] = buf
            current, buf = line.strip(), []
        else:
            buf.append(line)
    if current:
        doc['sections'][current] = buf

    # Experience: a tabbed line opens a role; plain lines below are its bullets.
    roles = []
    for line in doc['sections']['PROFESSIONAL EXPERIENCE']:
        if line.startswith('\t'):
            parts = [p.strip() for p in line.split('\t') if p.strip()]
            heading, dates = parts[0], (parts[1] if len(parts) > 1 else '')
            role, _, company = heading.partition('—')
            roles.append({'role': role.strip(), 'company': company.strip(),
                          'dates': dates, 'bullets': []})
        elif roles:
            roles[-1]['bullets'].append(line.strip())
    doc['experience'] = roles

    # Projects: "Name — repo" followed by one description paragraph.
    projects, pending = [], None
    for line in doc['sections']['PROJECTS']:
        if '—' in line and 'github.com' in line:
            name, _, repo = line.partition('—')
            pending = {'name': name.strip(), 'repo': repo.strip(), 'summary': ''}
            projects.append(pending)
        elif pending:
            pending['summary'] = (pending['summary'] + ' ' + line.strip()).strip()
    doc['projects'] = projects

    doc['skills'] = [tuple(x.strip() for x in l.split(':', 1))
                     for l in doc['sections']['CORE SKILLS'] if ':' in l]
    doc['summary'] = ' '.join(doc['sections']['PROFESSIONAL SUMMARY'])
    doc['education'] = doc['sections']['EDUCATION']
    doc['certifications'] = doc['sections']['CERTIFICATIONS']
    return doc

if __name__ == '__main__':
    print(json.dumps(parse(sys.argv[1]), indent=1, ensure_ascii=False))
