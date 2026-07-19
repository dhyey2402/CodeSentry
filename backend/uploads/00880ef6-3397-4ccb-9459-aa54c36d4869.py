inp =(input())
if inp.lstrip('-').isdigit():   
    if int(inp)>0:
        print("Positive")
    elif int(inp)<0:
        print("Negative")
    else:
        print("Zero")
else:
    print("Wrong Input")