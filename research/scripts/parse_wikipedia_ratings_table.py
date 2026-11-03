import re,sys
lines=open(sys.argv[1]).read().split('\n')[1900:2612]
rat=re.compile(r"(Solid|Safe|Likely|Lean|Tilt|Tossup)\s*([RD])?\s*(\(flip\))?")
cur=None;out=[]
states=set("Alabama Alaska Arkansas Colorado Delaware Florida(special) Georgia Idaho Illinois Iowa Kansas Kentucky Louisiana Maine Massachusetts Michigan Minnesota Mississippi Montana Nebraska New Hampshire;New Jersey;New Mexico;North Carolina;Ohio(special);Oklahoma Oregon Rhode Island;South Carolina;South Dakota;Tennessee Texas Virginia West Virginia;Wyoming".replace(';',' ').split(' '))
names=["Alabama","Alaska","Arkansas","Colorado","Delaware","Florida(special)","Georgia","Idaho","Illinois","Iowa","Kansas","Kentucky","Louisiana","Maine","Massachusetts","Michigan","Minnesota","Mississippi","Montana","Nebraska","New Hampshire","New Jersey","New Mexico","North Carolina","Ohio(special)","Oklahoma","Oregon","Rhode Island","South Carolina","South Dakota","Tennessee","Texas","Virginia","West Virginia","Wyoming"]
for l in lines:
    s=l.strip()
    if s in names:
        cur=[s,[]];out.append(cur);continue
    if cur and ("]}'>" in s or re.fullmatch(r"(Solid|Safe|Likely|Lean|Tilt|Tossup).*",s)):
        t=s.split("]}'>")[-1]
        m=rat.match(t.strip())
        if m and len(cur[1])<12: cur[1].append(t.strip().replace(' (flip)','*'))
hdr="Cook DDHQ Econ FPO Fox IE MSNOW NBC RCP Sabato Silver ST".split()
print("State|"+"|".join(hdr))
for s,r in out: print(s+"|"+"|".join(r))
