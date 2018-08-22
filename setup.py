import os
import time
import webbrowser

print("Beginning set-up")
os.system("pip3 install -r requirements.txt")
print("Step1-> setting clustername")
os.system("python3 settings.py")
print("Step2-> adding the git repository")
os.system("git add .")
print("Step 3->commit and pushing to hasura cluster")
os.system("git commit -m'Initial Commit'")
x=os.system("git push hasura master")

if(x!=0):
    print("Remote server :EROR Redeploying it may take seconds...")
while(x!=0):
    time.sleep(1)
    x=os.system("git push hasura master")

import yaml
with open("clusters.yaml", 'r') as stream:
    try:
        clustername=yaml.load(stream)[0]['name']
        print(clustername)
    except yaml.YAMLError as exc:
        print(exc)


print("Deployement succesfull!!")
print("Trying to open the url..Hold on.........")

time.sleep(10)

try:
    webbrowser.open("https://ui."+clustername+".hasura-app.io/")
except:
    print("Opening failed.Try "+"https://ui."+clustername+".hasura-app.io/"+" opening manually..")
