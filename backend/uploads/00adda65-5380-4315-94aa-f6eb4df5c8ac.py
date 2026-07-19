

t = int(input())


if 1 <= t <= 6840:
    
    for _ in range(t):
      
        a, b, c = map(int, input().split())
        
        
        if 1 <= a <= 20 and 1 <= b <= 20 and 1 <= c <= 20 and a != b and b != c and a != c:
         
            if (a > b and a < c) or (a < b and a > c):
                print(a)
            elif (b > a and b < c) or (b < a and b > c):
                print(b)
            else:
                print(c)

     








