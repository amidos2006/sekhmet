import csv
import json

cards = {
    
}
with open("assets/data/cards.csv") as f:
    csv_file = csv.DictReader(f)
    for row in csv_file:
        row["Attack"] = int(row["Attack"])
        row["Health"] = int(row["Health"])
        row["Cooldown"] = int(row["Cooldown"])
        cards[row["Name"]] = row

json_string = json.dumps(cards, indent=2)
with open("assets/data/cards.json", "w") as f:
    f.write(json_string)