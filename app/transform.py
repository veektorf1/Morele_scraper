import pandas as pd

# Exemplary data structure
# This is a sample JSON data structure that would be in the "data.json" file.
'''
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
'''


def load_data() -> pd.DataFrame:
    '''
    Load data from a JSON file and returns it as a DataFrame.
    '''
    df = pd.read_json("data.json")
    return df

def transform(dfOrginal: pd.DataFrame) -> pd.DataFrame:
    '''
    Transform the input DataFrame by converting units, renaming columns, dropping them
    and applying feature enginnering creating new columns.
    '''
    df_transformed = dfOrginal.copy()

    # Card length unit only in mm; clock speed unit only in MHz
    df_transformed['card_length_mm'] = df_transformed['card_length'].copy()
    df_transformed['clock_speed_MHz'] = df_transformed['clock_speed'].copy()
    df_transformed['RAM_GB'] = df_transformed['RAM'].copy()

    # Convert RAM size to GB if unit is MB
    df_transformed.loc[df_transformed['RAM_unit'] == 'MB', 'RAM_GB'] = df_transformed.apply(
        lambda x: x['RAM'] / 1024, axis=1)  
    df_transformed.loc[df_transformed['merging'] == 'Nie', 'merging'] = 'No'

    cols_to_drop = ['RAM_unit','RAM','clock_speed_unit','card_length_unit','card_length','clock_speed']
    df_transformed.drop(columns=cols_to_drop, inplace=True)

    # For further analysis It will not make any sense to keep the products with missinng prices,
    # therefore I decided to drop them
    df_transformed = df_transformed[df_transformed['price'].isna()==False]

    # New columns
    df_transformed['PricePer1GB'] = round(df_transformed['price'] / df_transformed['RAM_GB'],2)
    df_transformed['PricePer100MHz'] = round(100 * df_transformed['price'] / df_transformed['clock_speed_MHz'],2)

    return df_transformed

def save_to_csv(df: pd.DataFrame, filename: str):
    '''
    Save the DataFrame to a CSV file.
    '''
    df.to_csv(filename, index=False)
    print(f"Data saved to {filename}")

def main():
    df = load_data()
    df_transformed = transform(df)
    save_to_csv(df_transformed,'transformed.csv')

if __name__ == "__main__":
    main()