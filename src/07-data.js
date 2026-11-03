<script>
// ---------- SENATE: all 35 seats. pm = Polymarket D-win price read live 3 Nov 2026; desk = this page's D-win probability (opinion).
const SEN = [
 {st:"AL",name:"Alabama",inc:"Tuberville (R) retiring, running for governor",held:"R",open:true,d:"Everett Wess",r:"Barry Moore",o:"",cook:"Solid R",sab:"Safe R",ie:"Solid R",poll:"safe",pm:0.016,k:"",desk:0.02,et:"8:00 pm",ist:"06:30"},
 {st:"AK",name:"Alaska",inc:"Dan S. Sullivan (R) running",held:"R",open:false,d:"Mary Peltola",r:"Dan S. Sullivan",o:"Daniel J. Sullivan Jr. (no party); top-4 RCV",cook:"Toss-up",sab:"Lean D",ie:"Toss-up",poll:"SB Peltola +2.6 · RCP +1.2 · Siena 48–46",pm:0.715,k:"",desk:0.60,et:"12:00 am (Aleutians 1:00 am)",ist:"10:30",note:"RCV tabulation 18 Nov; DOJ certification suit dismissed 1 Nov, appeal pending"},
 {st:"AR",name:"Arkansas",inc:"Tom Cotton (R) running",held:"R",open:false,d:"Hallie Shoffner",r:"Tom Cotton",o:"Jeff Wadlin (L)",cook:"Solid R",sab:"Safe R",ie:"Solid R",poll:"safe",pm:0.021,k:"",desk:0.02,et:"8:30 pm",ist:"07:00"},
 {st:"CO",name:"Colorado",inc:"John Hickenlooper (D) running",held:"D",open:false,d:"John Hickenlooper",r:"Mark Baisley",o:"",cook:"Solid D",sab:"Safe D",ie:"Solid D",poll:"safe",pm:0.9875,k:"",desk:0.99,et:"9:00 pm",ist:"07:30"},
 {st:"DE",name:"Delaware",inc:"Chris Coons (D) running",held:"D",open:false,d:"Chris Coons",r:"Michael Katz",o:"",cook:"Solid D",sab:"Safe D",ie:"Solid D",poll:"safe",pm:0.989,k:"",desk:0.99,et:"8:00 pm",ist:"06:30"},
 {st:"FL",name:"Florida (special)",inc:"Ashley Moody (R) appointed 2025, running",held:"R",open:false,d:"Angie Nixon",r:"Ashley Moody",o:"",cook:"Likely R",sab:"Likely R",ie:"Likely R",poll:"Siena Moody +6 (50–44)",pm:0.145,k:"",desk:0.14,et:"7:00 pm (Panhandle 8:00)",ist:"05:30",note:"Rubio's former seat; fastest count in the country"},
 {st:"GA",name:"Georgia",inc:"Jon Ossoff (D) running",held:"D",open:false,d:"Jon Ossoff",r:"Mike Collins",o:"",cook:"Likely D",sab:"Likely D",ie:"Likely D",poll:"RCP Ossoff +8.2 · AJC 48–40",pm:0.9675,k:"",desk:0.93,et:"7:00 pm",ist:"05:30",note:"Runoff 1 Dec if nobody reaches 50%"},
 {st:"ID",name:"Idaho",inc:"Jim Risch (R) running",held:"R",open:false,d:"David Roth",r:"Jim Risch",o:"Todd Achilles (I) 3% on Polymarket",cook:"Solid R",sab:"Safe R",ie:"Solid R",poll:"safe",pm:0.0005,k:"",desk:0.01,et:"10:00 pm (north 11:00)",ist:"08:30"},
 {st:"IL",name:"Illinois",inc:"Dick Durbin (D) retiring",held:"D",open:true,d:"Juliana Stratton",r:"Don Tracy",o:"",cook:"Solid D",sab:"Safe D",ie:"Solid D",poll:"safe",pm:0.994,k:"",desk:0.99,et:"8:00 pm",ist:"06:30"},
 {st:"IA",name:"Iowa",inc:"Joni Ernst (R) retiring",held:"R",open:true,d:"Josh Turek",r:"Ashley Hinson",o:"Thomas Laehn (L)",cook:"Toss-up",sab:"Lean R",ie:"Toss-up",poll:"RCP Hinson +0.2 · SB Turek +0.7 · Siena Turek 48–47",pm:0.545,k:"Turek 52",desk:0.42,et:"9:00 pm",ist:"07:30",note:"Closest race on the map; Election-Day-heavy state"},
 {st:"KS",name:"Kansas",inc:"Roger Marshall (R) running",held:"R",open:false,d:"Adam Hamilton",r:"Roger Marshall",o:"David Graham (L)",cook:"Toss-up",sab:"Lean D",ie:"Toss-up",poll:"RCP Hamilton +2.6 · SB +3.3 · Siena 49–44",pm:0.625,k:"Hamilton 63",desk:0.45,et:"8:00 pm (west 9:00)",ist:"06:30",note:"No Democratic senator since 1932"},
 {st:"KY",name:"Kentucky",inc:"Mitch McConnell (R) retiring",held:"R",open:true,d:"Charles Booker",r:"Andy Barr",o:"Christopher Campbell (I)",cook:"Solid R",sab:"Safe R",ie:"Solid R",poll:"safe (DDHQ R 94%)",pm:0.032,k:"",desk:0.05,et:"6:00 pm east / 7:00 west",ist:"04:30"},
 {st:"LA",name:"Louisiana",inc:"Bill Cassidy (R) lost primary",held:"R",open:true,d:"Jamie Davis",r:"Julia Letlow",o:"",cook:"Solid R",sab:"Lean R",ie:"Likely R",poll:"none public",pm:0.125,k:"",desk:0.12,et:"9:00 pm",ist:"07:30",note:"Sabato is the most aggressive rater here"},
 {st:"ME",name:"Maine",inc:"Susan Collins (R) running",held:"R",open:false,d:"Troy Jackson",r:"Susan Collins",o:"",cook:"Toss-up",sab:"Lean D",ie:"Toss-up",poll:"RCP Jackson +1.7 · SB +4.0 · Siena 51–45 · Emerson Collins 51–49",pm:0.735,k:"Jackson 73",desk:0.60,et:"8:00 pm",ist:"06:30",note:"Collins beat her 2020 polls by ~8; Manchin endorsed her"},
 {st:"MA",name:"Massachusetts",inc:"Ed Markey (D) running",held:"D",open:false,d:"Ed Markey",r:"John Deaton",o:"Shiva Ayyadurai (I)",cook:"Solid D",sab:"Safe D",ie:"Solid D",poll:"safe",pm:0.9925,k:"",desk:0.99,et:"8:00 pm",ist:"06:30"},
 {st:"MI",name:"Michigan",inc:"Gary Peters (D) retiring",held:"D",open:true,d:"Abdul El-Sayed",r:"Mike Rogers",o:"",cook:"Lean D",sab:"Lean D",ie:"Tilt D",poll:"SB El-Sayed +4.7 · Siena 53–42 · CNN 49–42",pm:0.805,k:"El-Sayed 78",desk:0.78,et:"8:00 pm (4 UP counties 9:00)",ist:"06:30",note:"Cook moved it from Toss-up on 2 Nov; Haley Stevens endorsed Rogers on 1 Nov"},
 {st:"MN",name:"Minnesota",inc:"Tina Smith (D) retiring",held:"D",open:true,d:"Peggy Flanagan",r:"Michele Tafoya",o:"Marisa Simonetti (I)",cook:"Lean D",sab:"Likely D",ie:"Lean D",poll:"Siena Flanagan +14 · KSTP/SurveyUSA +3 (Oct)",pm:0.915,k:"Flanagan 90",desk:0.88,et:"9:00 pm",ist:"07:30"},
 {st:"MS",name:"Mississippi",inc:"Cindy Hyde-Smith (R) running",held:"R",open:false,d:"Scott Colom",r:"Cindy Hyde-Smith",o:"Ty Pinkins (I)",cook:"Likely R",sab:"Likely R",ie:"Likely R",poll:"Change Research (D firm) Hyde-Smith 43–40; the Wedgewood 52–48 poll was fabricated",pm:0.14,k:"",desk:0.13,et:"8:00 pm",ist:"06:30",note:"Espy was within 1 in 2020 polls and lost by 10"},
 {st:"MT",name:"Montana",inc:"Steve Daines (R) retiring",held:"R",open:true,d:"Alani Bankhead",r:"Kurt Alme",o:"Seth Bodnar (I), Kyle Austin (L)",cook:"Solid R",sab:"Safe R",ie:"Solid R",poll:"MSU-Billings Alme +4 over Bodnar",pm:0.0045,k:"",desk:0.04,et:"10:00 pm",ist:"08:30",note:"Polymarket: Alme 90.5%, Bodnar (I) 9%"},
 {st:"NE",name:"Nebraska",inc:"Pete Ricketts (R) running",held:"R",open:false,d:"none (Burbank withdrew 17 Jul)",r:"Pete Ricketts",o:"Dan Osborn (I)",cook:"Lean R",sab:"Lean R",ie:"Tilt R",poll:"Siena Ricketts 49–43 · YouGov (Sep) Osborn 48–47",pm:0.325,k:"",desk:0.30,et:"9:00 pm",ist:"07:30",note:"Market and desk figures are Osborn's chance; his caucus is unconfirmed, so not a D seat"},
 {st:"NH",name:"New Hampshire",inc:"Jeanne Shaheen (D) retiring",held:"D",open:true,d:"Chris Pappas",r:"John E. Sununu",o:"Edmond LaPlante (Const.)",cook:"Lean D",sab:"Likely D",ie:"Tilt D",poll:"UMass Lowell/YouGov Pappas 48–41",pm:0.945,k:"",desk:0.92,et:"8:00 pm (some towns 7:00)",ist:"06:30"},
 {st:"NJ",name:"New Jersey",inc:"Cory Booker (D) running",held:"D",open:false,d:"Cory Booker",r:"Justin Murphy",o:"",cook:"Solid D",sab:"Safe D",ie:"Solid D",poll:"safe",pm:0.9875,k:"",desk:0.99,et:"8:00 pm",ist:"06:30"},
 {st:"NM",name:"New Mexico",inc:"Ben Ray Luján (D) running",held:"D",open:false,d:"Ben Ray Luján",r:"Larry Marker",o:"",cook:"Solid D",sab:"Safe D",ie:"Solid D",poll:"safe",pm:0.9945,k:"",desk:0.99,et:"9:00 pm",ist:"07:30"},
 {st:"NC",name:"North Carolina",inc:"Thom Tillis (R) retiring",held:"R",open:true,d:"Roy Cooper",r:"Michael Whatley",o:"Shannon Bray (L)",cook:"Likely D",sab:"Likely D",ie:"Lean D",poll:"RCP Cooper +10.7 · WRAL 54–40 · AtlasIntel 56–42",pm:0.978,k:"",desk:0.95,et:"7:30 pm",ist:"06:00",note:"SLF paused ad spending 2 Oct"},
 {st:"OH",name:"Ohio (special)",inc:"Jon Husted (R) appointed 2025, running",held:"R",open:false,d:"Sherrod Brown",r:"Jon Husted",o:"Greg Levy (I), William Redpath (L)",cook:"Toss-up",sab:"Lean D",ie:"Tilt D",poll:"RCP Brown +2.6 · SB +3.0 · Siena 49–44 · Rasmussen Husted 49–47",pm:0.715,k:"Brown 71",desk:0.70,et:"7:30 pm",ist:"06:00",note:"Vance's former seat; $435M spent"},
 {st:"OK",name:"Oklahoma",inc:"Alan Armstrong (R) appointed, barred from ballot",held:"R",open:true,d:"N'Kiyla J. Thomas",r:"Kevin Hern",o:"2 independents, 1 Libertarian",cook:"Solid R",sab:"Safe R",ie:"Solid R",poll:"safe",pm:0.013,k:"",desk:0.01,et:"8:00 pm",ist:"06:30"},
 {st:"OR",name:"Oregon",inc:"Jeff Merkley (D) running",held:"D",open:false,d:"Jeff Merkley",r:"David Brock Smith",o:"",cook:"Solid D",sab:"Safe D",ie:"Solid D",poll:"safe",pm:0.9895,k:"",desk:0.99,et:"11:00 pm (east 10:00)",ist:"09:30"},
 {st:"RI",name:"Rhode Island",inc:"Jack Reed (D) running",held:"D",open:false,d:"Jack Reed",r:"Raymond McKay",o:"Michael Bahry (I)",cook:"Solid D",sab:"Safe D",ie:"Solid D",poll:"WPRI/Emerson Reed +34",pm:0.9925,k:"",desk:0.99,et:"8:00 pm",ist:"06:30"},
 {st:"SC",name:"South Carolina",inc:"Darline Graham (R) appointed Jul 2026, running",held:"R",open:false,d:"Annie Andrews",r:"Darline Graham (Nordone)",o:"Kasie Whitener (L), Mark Hackett (Const.)",cook:"Lean R",sab:"Lean R",ie:"Tilt R",poll:"RCP Graham +2.7 · SB +1.3 · Siena tied 48–48",pm:0.305,k:"Andrews 33",desk:0.25,et:"7:00 pm",ist:"05:30",note:"Lindsey Graham died 11 Jul; his sister was appointed"},
 {st:"SD",name:"South Dakota",inc:"Mike Rounds (R) running",held:"R",open:false,d:"Julian Beaudion (June listing, unconfirmed)",r:"Mike Rounds",o:"Brian Bengs (I) 6% on Polymarket",cook:"Solid R",sab:"Safe R",ie:"Solid R",poll:"safe",pm:0.0005,k:"",desk:0.02,et:"8:00 / 9:00 pm",ist:"06:30 / 07:30"},
 {st:"TN",name:"Tennessee",inc:"Bill Hagerty (R) running",held:"R",open:false,d:"Marquita Bradshaw",r:"Bill Hagerty",o:"8 independents",cook:"Solid R",sab:"Safe R",ie:"Solid R",poll:"safe",pm:0.017,k:"",desk:0.02,et:"8:00 pm",ist:"06:30"},
 {st:"TX",name:"Texas",inc:"John Cornyn (R) lost runoff to Paxton",held:"R",open:true,d:"James Talarico",r:"Ken Paxton",o:"Ted Brown (L)",cook:"Toss-up",sab:"Lean D",ie:"Tilt D",poll:"RCP Talarico +1.8 · SB +3.5 · Siena 50–43 · Rasmussen tied",pm:0.745,k:"Talarico 74–75",desk:0.55,et:"8:00 pm (El Paso 9:00)",ist:"06:30",note:"Talarico $158M raised v Paxton $39M; 7.7M early votes"},
 {st:"VA",name:"Virginia",inc:"Mark Warner (D) running",held:"D",open:false,d:"Mark Warner",r:"Bert Mizusawa",o:"",cook:"Solid D",sab:"Safe D",ie:"Solid D",poll:"safe",pm:0.99,k:"",desk:0.99,et:"7:00 pm",ist:"05:30"},
 {st:"WV",name:"West Virginia",inc:"Shelley Moore Capito (R) running",held:"R",open:false,d:"Rachel Fetty Anderson",r:"Shelley Moore Capito",o:"S. Marshall Wilson (Const.)",cook:"Solid R",sab:"Safe R",ie:"Solid R",poll:"safe",pm:0.0135,k:"",desk:0.01,et:"7:30 pm",ist:"06:00"},
 {st:"WY",name:"Wyoming",inc:"Cynthia Lummis (R) retiring",held:"R",open:true,d:"James W. Byrd",r:"Harriet Hageman",o:"",cook:"Solid R",sab:"Safe R",ie:"Solid R",poll:"safe",pm:0.0155,k:"",desk:0.01,et:"9:00 pm",ist:"07:30"}
];
// Tile grid positions (col,row) for all 50 states + DC; rough geography.
const GRID = {AK:[0,0],ME:[10,0],VT:[9,1],NH:[10,1],WA:[0,2],ID:[1,2],MT:[2,2],ND:[3,2],MN:[4,2],IL:[5,2],WI:[6,2],MI:[7,2],NY:[8,2],RI:[9,2],MA:[10,2],
 OR:[0,3],NV:[1,3],WY:[2,3],SD:[3,3],IA:[4,3],IN:[5,3],OH:[6,3],PA:[7,3],NJ:[8,3],CT:[9,3],
 CA:[0,4],UT:[1,4],CO:[2,4],NE:[3,4],MO:[4,4],KY:[5,4],WV:[6,4],VA:[7,4],MD:[8,4],DE:[9,4],
 AZ:[1,5],NM:[2,5],KS:[3,5],AR:[4,5],TN:[5,5],NC:[6,5],SC:[7,5],DC:[8,5],
 OK:[3,6],LA:[4,6],MS:[5,6],AL:[6,6],GA:[7,6],HI:[0,7],TX:[3,7],FL:[8,7]};

// ---------- HOUSE: every seat rated Toss-up or Lean by any of the three raters, plus redrawn seats and Likely seats one rater has closer.
// held: R/D/I/V(vacant)/N(new). TU toss-up, LnD/LnR lean, LkD/LkR likely, TD/TR tilt, SD/SR solid. nf = not found. rd = redrawn.
const HSE = [
 ["AL","AL-2","Shomari Figures (D)","D","Figures","nf (Marques per DDHQ)","LnR","LnD","TR","Trump +14 on new lines",1],
 ["AK","AK-AL","Nick Begich (R)","R","nf","Begich","LnR","LnR","LkR","",0],
 ["AR","AR-2","French Hill (R)","R","nf","Hill","LkR","nf","nf","Wave-depth indicator; closes 07:00 IST",0],
 ["AZ","AZ-1","Open (Schweikert, R)","R","Amish Shah","Jay Feely","LnD","LnD","TD","",0],
 ["AZ","AZ-2","Eli Crane (R)","R","nf","Crane","LnR","LnR","LnR","",0],
 ["AZ","AZ-6","Juan Ciscomani (R)","R","JoAnna Mendoza","Ciscomani","LnD","LnD","TD","",0],
 ["CA","CA-1","James Gallagher (R)","R","nf","Gallagher","SD","SD","SD","Prop 50 flip; LaMalfa died",1],
 ["CA","CA-3","Open (Kiley's old seat)","R","Ami Bera","nf","SD","SD","SD","Prop 50 flip",1],
 ["CA","CA-6","Kevin Kiley (no party)","I","Richard Pan","Kiley (NPP)","SD","LkD","LkD","Prop 50; Kiley left the GOP",1],
 ["CA","CA-13","Adam Gray (D)","D","Gray","Kevin Lincoln","LkD","LkD","TD","2024: Gray by under 200 votes",0],
 ["CA","CA-22","David Valadao (R)","R","Randy Villegas","Valadao","TU","LnD","TU","Prop 50 target",1],
 ["CA","CA-48","Open (Issa, R)","R","Marni Von Wilpert","Jim Desmond","LnD","LkD","TD","Prop 50 target; Harris-won",1],
 ["CO","CO-3","Jeff Hurd (R)","R","nf","Hurd","LkR","LkR","LkR","DDHQ top-10 race",0],
 ["CO","CO-4","Lauren Boebert (R)","R","nf","Boebert","LnR","LnR","LkR","",0],
 ["CO","CO-5","Jeff Crank (R)","R","nf","Crank","TU","LnD","TU","",0],
 ["CO","CO-8","Gabe Evans (R)","R","Manny Rutinel","Evans","LnD","LnD","TD","",0],
 ["FL","FL-7","Open (Mills, R, lost primary)","R","nf","nf","LnR","LkR","LkR","",0],
 ["FL","FL-9","Darren Soto (D)","D","Soto","nf","LnR","LkR","LkR","Redrawn to ~Trump +18; DDHQ toss-up 30 Oct",1],
 ["FL","FL-13","Anna Paulina Luna (R)","R","nf","Luna","LnR","LnR","LnR","",0],
 ["FL","FL-14","Kathy Castor (D)","D","Castor","Mike Beltran","TU","LnD","TD","Redrawn target",1],
 ["FL","FL-22","Open (Frankel moved to FL-23)","D","Pia Dandiya","Casey Askar","TU","LnD","TU","Now Trump +10 (was Harris +5)",1],
 ["FL","FL-25","Jared Moskowitz (D)","D","Moskowitz","Scott Singer","LnD","LnD","TD","Redrawn target",1],
 ["FL","FL-27","María Salazar (R)","R","nf","Salazar","LnR","LnR","LnR","CLF cancelled $6M Miami TV",0],
 ["IN","IN-5","Victoria Spartz (R)","R","nf","Spartz","LnR","LkR","LkR","Hamilton County is the 04:30 IST bellwether",0],
 ["IA","IA-1","Mariannette Miller-Meeks (R)","R","Christina Bohannan","Miller-Meeks","LnD","LnD","TD","",0],
 ["IA","IA-2","Open (Hinson, R, running for Senate)","R","Lindsay James","Joe Mitchell","TU","LnD","TU","",0],
 ["IA","IA-3","Zach Nunn (R)","R","Sarah Trone Garriott","Nunn","LnD","LnD","TD","2024: Nunn by under 4",0],
 ["KY","KY-6","Open (Barr, R, running for Senate)","R","Zach Dembo","Ralph Alvarado","TU","LnR","TU","Sabato moved TU to Lean R 2 Nov",0],
 ["LA","LA-6","Cleo Fields (D)","D","Fields","nf","SR","nf","SR","Redrawn after Callais; DDHQ: R 'all but guaranteed'",1],
 ["ME","ME-2","Open (Golden, D)","D","nf","nf","LnR","LnR","LnR","DDHQ top-10; ranked-choice, slow count",0],
 ["MI","MI-4","Bill Huizenga (R)","R","Sean McCann","Huizenga","TU","LnD","TU","",0],
 ["MI","MI-7","Tom Barrett (R)","R","William Lawrence","Barrett","TU","LnD","TU","",0],
 ["MI","MI-10","Open (James, R)","R","Christina Hines","Michael Bouchard","TU","LnD","TR","",0],
 ["MN","MN-1","Brad Finstad (R)","R","nf","Finstad","LnR","LnR","LnR","",0],
 ["MO","MO-2","Ann Wagner (R)","R","nf","Wagner","LkR","LnR","nf","Sabato TU to Lean R 2 Nov; 2022 map in use",0],
 ["MT","MT-1","Open (Zinke, R)","R","nf","nf","TU","LnD","TU","",0],
 ["NE","NE-2","Open (Bacon, R)","R","nf","nf","LkD","nf","nf","Harris-won district",0],
 ["NV","NV-2","Open (Amodei, R)","R","nf","nf","LnR","LnR","TR","",0],
 ["NJ","NJ-7","Tom Kean Jr. (R)","R","Rebecca Bennett","Kean","LnD","LnD","TD","",0],
 ["NM","NM-2","Gabe Vasquez (D)","D","Vasquez","Greg Cunningham","LnD","LnD","TD","",0],
 ["NY","NY-17","Mike Lawler (R)","R","Cait Conley","Lawler","TU","LnR","TU","Harris-won; Sabato to Lean R 2 Nov",0],
 ["NY","NY-21","Open (Stefanik, R)","R","nf","nf","LnR","LnR","LnR","",0],
 ["NC","NC-1","Don Davis (D)","D","Davis","Laurie Buckhout","TU","LnD","TD","Redrawn to Trump +12",1],
 ["NC","NC-11","Open (Edwards, R, withdrew)","R","Jamie Ager","Jennifer Balkom","LnD","LnD","TD","",0],
 ["OH","OH-7","Max Miller (R)","R","nf","Miller","TU","LnD","TD","",0],
 ["OH","OH-9","Marcy Kaptur (D)","D","Kaptur","Derek Merrin","LnD","LnD","TD","Commission map; 2024 by ~2,400 votes",1],
 ["OH","OH-10","Mike Turner (R)","R","nf","Turner","LnR","LnR","LnR","",0],
 ["OH","OH-15","Mike Carey (R)","R","nf","Carey","LnR","LnR","LnR","",0],
 ["PA","PA-1","Brian Fitzpatrick (R)","R","Bob Harvie","Fitzpatrick","TU","LnD","TU","Harris-won; Fitzpatrick won by ~13 in 2024",0],
 ["PA","PA-7","Ryan Mackenzie (R)","R","Bob Brooks","Mackenzie","LnD","LnD","TD","2024: R +1",0],
 ["PA","PA-8","Rob Bresnahan (R)","R","Paige Cognetti","Bresnahan","LnD","LnD","TD","Cook: Bresnahan trailed recent polling",0],
 ["PA","PA-10","Scott Perry (R)","R","Janelle Stelson","Perry","LnD","LnD","TD","2024: Perry by ~5,000 votes",0],
 ["SC","SC-1","Open (Mace, R)","R","nf","nf","TU","LnR","TR","Trump double-digit district",0],
 ["TN","TN-9","Open (Cohen, D)","D","nf","nf","SR","nf","LkR","Redrawn for a 9–0 delegation; IE to Likely R 31 Oct",1],
 ["TX","TX-9","New seat (Al Green's old base)","N","Leticia Gutierrez","Alex Mealer","LkR","LkR","LnR","Trump 59.5% on new lines",1],
 ["TX","TX-15","Monica De La Cruz (R)","R","Bobby Pulido","De La Cruz","TU","LnD","TD","Shored up to Trump +18–20, still rated close",1],
 ["TX","TX-23","Vacant (R)","V","nf","nf","LnR","LnR","LkR","",0],
 ["TX","TX-28","Henry Cuellar (D)","D","Cuellar","Tano Tijerina","LkD","LnD","LnD","Redrawn redder",1],
 ["TX","TX-34","Vicente Gonzalez (D)","D","Gonzalez","Eric Flores","LnD","LnD","TU","Trump-won; DDHQ Likely D",1],
 ["TX","TX-35","New/open (Casar moved to TX-37)","N","Johnny Garcia","Carlos De La Cruz","TU","LnD","TU","Redrawn R target",1],
 ["UT","UT-1","New seat (court map)","N","nf","nf","SD","nf","SD","Court-drawn Salt Lake seat",1],
 ["VA","VA-1","Rob Wittman (R)","R","Shannon Taylor","Wittman","TU","LnD","TR","",0],
 ["VA","VA-2","Jen Kiggans (R)","R","Elaine Luria","Kiggans","LnD","LnD","TD","DDHQ: must-win for Democrats",0],
 ["VA","VA-5","John McGuire (R)","R","Tom Perriello","McGuire","LkR","LnD","LnR","Kalshi McGuire 64% (2 Nov)",0],
 ["WA","WA-3","Marie Gluesenkamp Perez (D)","D","Gluesenkamp Perez","John Braun","LnD","LnD","TU","Trump-won; slow mail count",0],
 ["WI","WI-1","Bryan Steil (R)","R","nf","Steil","LnR","LnR","LnR","",0],
 ["WI","WI-3","Derrick Van Orden (R)","R","Rebecca Cooke","Van Orden","LnD","LnD","TD","2024: R by under 3",0]
];
// Poll-closing slot (IST) by state, for the timeline counts.
const SLOT = {AR:"07:00",IN:"04:30",KY:"04:30",GA:"05:30",SC:"05:30",VA:"05:30",VT:"05:30",FL:"05:30",NH:"05:30",NC:"06:00",OH:"06:00",WV:"06:00",
 ME:"06:30",PA:"06:30",NJ:"06:30",MA:"06:30",DE:"06:30",MD:"06:30",IL:"06:30",MO:"06:30",MS:"06:30",AL:"06:30",TN:"06:30",OK:"06:30",MI:"06:30",TX:"06:30",KS:"06:30",CT:"06:30",RI:"06:30",DC:"06:30",
 AR:"07:00",IA:"07:30",NE:"07:30",MN:"07:30",CO:"07:30",NM:"07:30",NY:"07:30",WI:"07:30",AZ:"07:30",LA:"07:30",WY:"07:30",SD:"07:30",ND:"07:30",
 NV:"08:30",MT:"08:30",UT:"08:30",ID:"08:30",CA:"09:30",WA:"09:30",OR:"09:30",HI:"09:30",AK:"10:30"};
// ---------- RESULTS, election night. Add calls here; never edit the pre-election rows above.
// One line per called race. w: winner "D" | "R" | "I" (Osborn); m: margin as reported, e.g. "+9.8" or "nf";
// by: the outlet that called it (AP, DDHQ, NBC ...); at: IST date and time entered, "2026-11-04 06:42"; n: optional note.
const RES_SEN = {
  // NC: {w:"D", m:"+9.8", by:"AP", at:"2026-11-04 06:42"},
};
// House: keyed by district as written in HSE, e.g. "PA-7".
const RES_HSE = {
  // "PA-7": {w:"D", m:"+2.1", by:"AP", at:"2026-11-04 09:10"},
};
// Overall House tally across all 435 seats, from one outlet; null until the first entry.
const RES_HOUSE_TOTAL = null; // e.g. {d:120, r:98, by:"AP", at:"2026-11-04 08:15"}
// Chamber control calls; null until an outlet calls control.
const RES_CONTROL = {senate:null, house:null}; // e.g. house:{w:"D", by:"AP", at:"2026-11-04 13:05"}
// ---------- LIVE UPDATES, newest entries anywhere in the list (the page sorts by time).
// at: IST "YYYY-MM-DD HH:MM"; tag: "senate" | "house" | "desk" | "night"; h: headline; t: text; by: source (outlet, or "Desk" for opinion);
// st: optional state code (links the entry to the map). Called races from RES_SEN / RES_HSE are added automatically; do not repeat them here.
const LIVE = [
  {at:"2026-11-03 19:00", tag:"night", h:"Live coverage opens", t:"The desk will log calls, counts and notable shifts here through the night. First polls close at 04:30 IST on Wednesday 4 November, in most of Indiana and Kentucky. Every result names the outlet that called it; the pre-election calls on this page stay as written.", by:"Desk"},
  {at:"2026-11-03 19:00", tag:"house", st:"IN", h:"The first tell: Hamilton County, Indiana", t:"In IN-5 (Spartz), Trump won the county 52-46 and Spartz carried it by 11 in 2024. How much she loses there is the first read on the size of the night.", by:"Desk research (House report, 3 Nov)"}
  {at:"2026-11-03 19:57", tag:"night", h:"Early vote ran ahead of 2022 in every Senate battleground", t:"Early voting broke recent midterm records, and early turnout exceeded the last midterm in each of the major Senate battlegrounds; in several key states the Democratic share of registered voters in the early vote rose. Separately, a power outage briefly shut two voting sites near Phoenix on Monday (CNN, 2 Nov).", by:"New York Times live, 3 Nov 9:27 ET"},
  {at:"2026-11-03 20:05", tag:"desk", h:"How much to read into the early vote", t:"Not much on its own. Early-vote party registration measures who voted early, not how they voted, and Republicans have shifted toward early voting since 2022, so record early turnout fits both sides' stories. The tell comes after 04:30 IST: whether the first counted counties (Hamilton County, Indiana; Kentucky's suburbs) move toward Democrats by more than the polls imply.", by:"Desk"},
];
</script>
