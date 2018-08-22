import os
import yaml
import fileinput
with open("clusters.yaml", 'r') as stream:
    try:
        clustername=yaml.load(stream)[0]['name']
        print(clustername)
    except yaml.YAMLError as exc:
        print(exc)




with fileinput.FileInput("microservices/ui/app/src/App.js", inplace=True, backup='.bak') as file:
    for line in file:
        print(line.replace("cluster", clustername), end='')

print("Settings successfully applied moving on..")

