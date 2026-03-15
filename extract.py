import fitz
doc = fitz.open('CV-ValerioSimeraro-Rivisto.pdf')
text = ""
for page in doc:
    text += page.get_text()
with open('cv_text.txt', 'w', encoding='utf-8') as f:
    f.write(text)
