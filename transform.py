import pandas as pd

# Exemplary Input data
data = {
    "card_length": "302",
    "card_length_unit": "mm",
    "RAM": "16",
    "RAM_unit": "GB",
    "chipset": "Radeon RX 7800 XT",
    "clock_speed": "2565",
    "clock_speed_unit": "MHz",
    "merging": "Nie",
    "rating_count": "133",
    "questions_count": "50",
    "purchases_count": "1038",
    "rating": "5.00",
    "name": "Karta graficzna Gigabyte Radeon RX 7800 XT Gaming OC 16GB GDDR6 (GV-R78XTGAMING OC-16GD)",
    "price": "2199"
}

# Convert data to a DataFrame
df = pd.read_json("data.json")

# Transformations
# Convert numeric columns to appropriate data types
df["card_length"] = pd.to_numeric(df["card_length"])
df["RAM"] = pd.to_numeric(df["RAM"])
df["clock_speed"] = pd.to_numeric(df["clock_speed"])
df["rating_count"] = pd.to_numeric(df["rating_count"])
df["questions_count"] = pd.to_numeric(df["questions_count"])
df["purchases_count"] = pd.to_numeric(df["purchases_count"])
df["rating"] = pd.to_numeric(df["rating"])
df["price"] = pd.to_numeric(df["price"])

# Add a new column combining card length and unit
df["card_length_full"] = df["card_length"].astype(str) + " " + df["card_length_unit"]

# Add a new column combining RAM and unit
df["RAM_full"] = df["RAM"].astype(str) + " " + df["RAM_unit"]

# Add a new column combining clock speed and unit
df["clock_speed_full"] = df["clock_speed"].astype(str) + " " + df["clock_speed_unit"]

# Display the transformed DataFrame
# print(df[ (df["RAM_unit"]!='GB') & (df["RAM_unit"].isna()==False) ])
print(df)