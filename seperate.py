import pandas as pd
import os

# only test first 10 for now
data = pd.read_csv(f"metadata.csv")

image_names = [f for f in os.listdir() if f[-4:] == ".jpg"]

for file in image_names:
    file = file[:-4]
    # ignore any other files
    if "ISIC" in file and len(data[data["name"]==file]) == 1:
        classification = data[data["name"] == file]["meta.clinical.benign_malignant"].iloc[0]
        print(classification)
        if classification == "benign":
            # add to benign dir
            os.rename(f"{file}.jpg", f"benign_{file}.jpg")
        elif classification == "malignant":
            # add to malignant dir
            os.rename(f"{file}.jpg", f"malignant_{file}.jpg")
    else:
        print(file)

