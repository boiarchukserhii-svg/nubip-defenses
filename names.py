"""Conservative Ukrainian genitive-to-nominative display conversion.
Never change source name; unknown cases remain in source form for manual review.
"""
import re

OVERRIDES = {
    'СУХІНИ Дениса Володимировича': 'СУХІНА Денис Володимирович',
    'ШЕВЧЕНКА Дмитра Віталійовича': 'ШЕВЧЕНКО Дмитро Віталійович',
    'ЧЕПУРНОЇ Оксани Леонідівни': 'ЧЕПУРНА Оксана Леонідівна',
    'ГУЦОЛА Руслана Івановича': 'ГУЦОЛ Руслан Іванович',
}

def person_nominative(original):
    if original in OVERRIDES: return OVERRIDES[original], 'verified_example'
    parts = original.split()
    if len(parts) != 3: return original, 'review'
    surname, name, patronymic = parts
    female = bool(re.search(r'(івни|ївни)$', patronymic, re.I))
    male = bool(re.search(r'(овича|евича|йовича|ича)$', patronymic, re.I))
    if not female and not male: return original, 'review'
    if male:
        if patronymic.endswith('овича') or patronymic.endswith('евича'):
            patronymic = patronymic[:-1]
        elif patronymic.endswith('ича'): patronymic = patronymic[:-1]
        common_names = {'Дениса':'Денис','Дмитра':'Дмитро','Руслана':'Руслан','Олександра':'Олександр','Андрія':'Андрій','Сергія':'Сергій','Івана':'Іван','Павла':'Павло','Володимира':'Володимир','Миколи':'Микола','Михайла':'Михайло','Віталія':'Віталій','Юрія':'Юрій','Максима':'Максим','Богдана':'Богдан','Романа':'Роман','Василя':'Василь','Петра':'Петро','Євгена':'Євген','Олега':'Олег','Ігоря':'Ігор','Анатолія':'Анатолій','Тараса':'Тарас'}
        name = common_names.get(name)
        if not name: return original, 'review'
        if surname.endswith('ЕНКА'): surname = surname[:-1]+'О'
        elif surname.endswith('ЬКОГО'): surname = surname[:-3]+'ИЙ'
        elif surname.endswith('СЬКОГО'): surname = surname[:-3]+'ИЙ'
        elif surname.endswith('ОВА') or surname.endswith('ЕВА') or surname.endswith('ІВА') or surname.endswith('ИНА'):
            surname = surname[:-1]
        elif surname.endswith('А'): surname = surname[:-1]
        else: return original, 'review'
    else:
        if patronymic.endswith('івни') or patronymic.endswith('ївни'): patronymic = patronymic[:-1]+'а'
        if name.endswith('и'): name = name[:-1]+'а'
        elif name.endswith('ї'): name = name[:-1]+'я'
        else: return original, 'review'
        if surname.endswith('НОЇ'): surname = surname[:-2]+'А'
        elif surname.endswith('КОЇ'): surname = surname[:-2]+'А'
        elif surname.endswith('ОЇ'): surname = surname[:-2]+'А'
        elif surname.endswith('И'): surname = surname[:-1]+'А'
        else: return original, 'review'
    return f'{surname} {name} {patronymic}', 'automatic_review'
