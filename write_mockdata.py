import os; full = os.path.join(os.getcwd(), 'src/data/mockData.js'); f = open(full, 'r', encoding='utf-8'); lines = len(f.readlines()); f.close(); print(f'mockData.js has {lines} lines')
