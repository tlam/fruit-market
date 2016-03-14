import csv
import json
import pprint


cards = []
nobles = []
with open('cards.csv', 'rb') as csvfile:
    reader = csv.reader(csvfile)
    count = 0
    for row in reader:
        level = row[0]
        if count > 2:
            if level == 'Noble':
                level, diamond_cost, sapphire_cost, emerald_cost, ruby_cost, onyx_cost, vp, diamond, sapphire, emerald, ruby, onyx, num, ratio = row
                nobles.append({
                    'diamond': int(diamond_cost or 0),
                    'sapphire': int(sapphire_cost or 0),
                    'emerald': int(emerald_cost or 0),
                    'ruby': int(ruby_cost or 0),
                    'onyx': int(onyx_cost or 0),
                    'vp': int(vp),
                })
            else:
                level, diamond_cost, sapphire_cost, emerald_cost, ruby_cost, onyx_cost, vp, diamond, sapphire, emerald, ruby, onyx, num, ratio = row
                cards.append({
                    'level': len(level),
                    'diamond_cost': int(diamond_cost or 0),
                    'sapphire_cost': int(sapphire_cost or 0),
                    'emerald_cost': int(emerald_cost or 0),
                    'ruby_cost': int(ruby_cost or 0),
                    'onyx_cost': int(onyx_cost or 0),
                    'vp': int(vp or 0),
                    'diamond': int(diamond or 0),
                    'sapphire': int(sapphire or 0),
                    'emerald': int(emerald or 0),
                    'ruby': int(ruby or 0),
                    'onyx': int(onyx or 0),
                })

        count += 1

fp = open('cards.json', 'w')
fp.write(json.dumps(cards))
fp.close()

fp = open('nobles.json', 'w')
fp.write(json.dumps(nobles))
fp.close()
