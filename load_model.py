import os
import sys
import pickle
import datetime

import numpy as np
import pandas as pd
import matplotlib.pyplot as plt

from sklearn.linear_model import LinearRegression
from sklearn.ensemble import GradientBoostingRegressor


if __name__ == "__main__":
    print(os.getcwd())
    particle = sys.argv[1]

    with open(f"{particle}.pkl", "rb") as f:
        model = pickle.load(f)

    now = datetime.datetime.now()
    hour = now.hour
    day = now.day
    month = now.month - 1

    X = np.array([hour, month, day])
    X = np.expand_dims(X, axis=0)
    res = model.predict(X)[0]
    
    print(res)