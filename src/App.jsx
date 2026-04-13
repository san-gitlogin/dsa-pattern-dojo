import { useState, useEffect, useRef } from "react";
import * as THREE from "three";
import { ArrowLeftRight, SlidersHorizontal, Target, Database, Layers, Network, GitBranch, Lightbulb, Zap, Gauge, CircleHelp, Code2, Eye, ChevronLeft, ChevronRight, Check } from "lucide-react";

/* ═══ Aurora Shader Background (inspired by 21st.dev animated-shader-background) ═══ */
function ShaderBG() {
  const containerRef = useRef(null);
  useEffect(function () {
    var container = containerRef.current;
    if (!container) return;
    var scene = new THREE.Scene();
    var camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    var renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.domElement.style.cssText = "position:fixed;top:0;left:0;width:100%;height:100%;z-index:0;pointer-events:none;mix-blend-mode:screen;opacity:0.7;";
    container.appendChild(renderer.domElement);

    var material = new THREE.ShaderMaterial({
      uniforms: {
        iTime: { value: 0 },
        iResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) }
      },
      vertexShader: "void main(){gl_Position=vec4(position,1.0);}",
      fragmentShader: [
        "uniform float iTime;",
        "uniform vec2 iResolution;",
        "#define NUM_OCTAVES 3",
        "float rand(vec2 n){return fract(sin(dot(n,vec2(12.9898,4.1414)))*43758.5453);}",
        "float noise(vec2 p){vec2 ip=floor(p);vec2 u=fract(p);u=u*u*(3.0-2.0*u);float res=mix(mix(rand(ip),rand(ip+vec2(1.0,0.0)),u.x),mix(rand(ip+vec2(0.0,1.0)),rand(ip+vec2(1.0,1.0)),u.x),u.y);return res*res;}",
        "float fbm(vec2 x){float v=0.0;float a=0.3;vec2 shift=vec2(100);mat2 rot=mat2(cos(0.5),sin(0.5),-sin(0.5),cos(0.5));for(int i=0;i<NUM_OCTAVES;++i){v+=a*noise(x);x=rot*x*2.0+shift;a*=0.4;}return v;}",
        "void main(){",
        "  vec2 shake=vec2(sin(iTime*1.2)*0.005,cos(iTime*2.1)*0.005);",
        "  vec2 p=((gl_FragCoord.xy+shake*iResolution.xy)-iResolution.xy*0.5)/iResolution.y*mat2(6.0,-4.0,4.0,6.0);",
        "  vec2 v;vec4 o=vec4(0.0);",
        "  float f=2.0+fbm(p+vec2(iTime*5.0,0.0))*0.5;",
        "  for(float i=0.0;i<35.0;i++){",
        "    v=p+cos(i*i+(iTime+p.x*0.08)*0.025+i*vec2(13.0,11.0))*3.5+vec2(sin(iTime*3.0+i)*0.003,cos(iTime*3.5-i)*0.003);",
        "    float tailNoise=fbm(v+vec2(iTime*0.5,i))*0.3*(1.0-(i/35.0));",
        "    vec4 auroraColors=vec4(0.05+0.15*sin(i*0.2+iTime*0.4),0.1+0.2*cos(i*0.3+iTime*0.5),0.3+0.15*sin(i*0.4+iTime*0.3),1.0);",
        "    vec4 currentContribution=auroraColors*exp(sin(i*i+iTime*0.8))/length(max(v,vec2(v.x*f*0.015,v.y*1.5)));",
        "    float thinnessFactor=smoothstep(0.0,1.0,i/35.0)*0.6;",
        "    o+=currentContribution*(1.0+tailNoise*0.8)*thinnessFactor;",
        "  }",
        "  o=tanh(pow(o/100.0,vec4(1.6)));",
        "  gl_FragColor=o*0.9;",
        "}"
      ].join("\n")
    });

    var geometry = new THREE.PlaneGeometry(2, 2);
    var mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    var frameId;
    var animate = function () {
      material.uniforms.iTime.value += 0.012;
      renderer.render(scene, camera);
      frameId = requestAnimationFrame(animate);
    };
    animate();

    var handleResize = function () {
      renderer.setSize(window.innerWidth, window.innerHeight);
      material.uniforms.iResolution.value.set(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", handleResize);

    return function () {
      cancelAnimationFrame(frameId);
      window.removeEventListener("resize", handleResize);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, []);
  return <div ref={containerRef} style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none" }} />;
}

const ICONS = {
  "arrow-lr": ArrowLeftRight,
  "sliders": SlidersHorizontal,
  "target": Target,
  "database": Database,
  "layers": Layers,
  "network": Network,
  "git-branch": GitBranch,
  "lightbulb": Lightbulb,
  "zap": Zap,
  "gauge": Gauge,
};

function PatIcon({ name, size, color }) {
  var Comp = ICONS[name];
  if (!Comp) return null;
  return <Comp size={size || 24} color={color || "currentColor"} strokeWidth={1.8} />;
}

const P = [
  {
    id:"two-pointers", name:"Two Pointers", icon:"arrow-lr", color:"#FF6B6B",
    tagline:"Two friends searching from both ends",
    complexity:"O(n) · O(1) space",
    signals:["sorted array","pair","sum","palindrome"],
    vizType:"array-ptrs",
    code:[
      "def two_sum_sorted(nums, target):",
      "    left = 0",
      "    right = len(nums) - 1",
      "",
      "    while left < right:",
      "        current = nums[left] + nums[right]",
      "",
      "        if current == target:",
      "            return [left, right]",
      "        elif current < target:",
      "            left += 1",
      "        else:",
      "            right -= 1",
      "",
      "    return []",
    ],
    steps:[
      { hl:[0], arr:[1,3,5,7,9,11], ptrs:{}, vars:{target:12},
        note:"Imagine you and your friend are at a library. Books are sorted by price: $1, $3, $5, $7, $9, $11. You have a $12 gift card and need to buy EXACTLY two books that total $12.\n\nThe slow way? Check every pair: 1+3, 1+5, 1+7... That is 15 pairs to check!\n\nThe smart way? You stand at the CHEAP end, your friend stands at the EXPENSIVE end. You each hold a book and check the total.",
        side:"Real life = library shopping\nArray = sorted price tags\nTarget = exact budget\n\nSlow way: check all pairs\nSmart way: start from\nboth ends!" },
      { hl:[1,2], arr:[1,3,5,7,9,11], ptrs:{L:0,R:5}, vars:{target:12,left:0,right:5},
        note:"left = 0 means \"start at the first book\" (cheapest: $1)\nright = len(nums) - 1 means \"start at the last book\" (most expensive: $11)\n\nIn Python, len(nums) gives us how many items we have (6 books). We subtract 1 because counting starts at 0, not 1. So the last book is at position 5.",
        side:"left = 0 (first item)\nright = 5 (last item)\n\nWhy start from ends?\nBecause sorted means\ncheapest is first,\nexpensive is last!" },
      { hl:[4,5], arr:[1,3,5,7,9,11], ptrs:{L:0,R:5}, vars:{target:12,left:0,right:5,current:12},
        note:"while left < right means: \"keep going as long as you and your friend have not bumped into each other yet.\"\n\ncurrent = nums[left] + nums[right] means: \"add up the two books you are each holding.\" That is $1 + $11 = $12.\n\nWait... that is EXACTLY our budget!",
        side:"while = keep repeating\nleft < right = until\nthey meet in the middle\n\nnums[0] + nums[5]\n= 1 + 11 = 12\n\nThat is our target!",
        challenge:{ q:"We found $1 + $11 = $12, which matches our target. What do we do?", opts:["Keep looking for more pairs","Tell your friend to pick a cheaper book","We are done! Return the answer!","Start over"], ans:2 } },
      { hl:[7,8], arr:[1,3,5,7,9,11], ptrs:{L:0,R:5}, vars:{target:12,result:"[0, 5]"},
        note:"return [left, right] means: \"tell the cashier which two books we picked\" — book at position 0 and book at position 5.\n\nDone! We only checked ONE pair and found our answer. But what if the first guess was wrong? Let us try with a $8 gift card instead...",
        side:"return = stop and give\nback the answer\n\n[0, 5] = positions of\nthe two winning books\n\n1 pair checked out of 15!\nThat is the power." },
      { hl:[4,5], arr:[1,3,5,7,9,11], ptrs:{L:0,R:5}, vars:{target:8},
        note:"NEW SCENARIO: Gift card is $8. You hold $1, your friend holds $11. Total = $12.\n\nToo expensive! Who should switch their book? Think about it:\n- If YOU pick a more expensive book, the total gets EVEN BIGGER (bad!)\n- If your FRIEND picks a cheaper book, the total gets SMALLER (good!)\n\nSo your friend walks one shelf to the left and picks up the next cheaper book.",
        side:"$1 + $11 = $12\nBudget is $8\n12 > 8, so too expensive!\n\nYour friend (right pointer)\nmust pick something\ncheaper = move LEFT.\n\nThis is the golden rule!" },
      { hl:[11,12], arr:[1,3,5,7,9,11], ptrs:{L:0,R:4}, vars:{target:8,left:0,right:4,current:10},
        note:"right -= 1 means: \"your friend moves one step to the left.\" Now they hold $9 instead of $11.\n\nNew total: $1 + $9 = $10. Still too expensive! Same logic: your friend should pick something even cheaper. They move left again.",
        side:"right goes from 5 to 4\nFriend now holds $9\n\n$1 + $9 = $10\nStill > $8... keep going!\n\nFriend moves left again.",
        challenge:{ q:"$1 + $9 = $10 is still more than $8. What should happen?", opts:["You pick a pricier book (move left right)","Your friend picks cheaper again (move right left)","Give up and leave"], ans:1 } },
      { hl:[7,8], arr:[1,3,5,7,9,11], ptrs:{L:0,R:3}, vars:{target:8,left:0,right:3,current:8},
        note:"Friend moves to position 3, holding $7. Total: $1 + $7 = $8. PERFECT!\n\nWe only checked 3 pairs instead of 15. And the beauty is: no matter how big the array gets, we never check more than n pairs (where n is the array size). That is what O(n) means — it grows linearly, not explosively.",
        side:"$1 + $7 = $8 = target!\n\n3 pairs checked out of 15.\nFor 1 million books,\nwe check at most 1M pairs\ninstead of 500 BILLION." },
      { hl:[], arr:[1,3,5,7,9,11], ptrs:{}, vars:{},
        note:"YOUR CHEAT SHEET:\n\n1. See \"sorted\" + \"find a pair\"? Think TWO POINTERS\n2. Total too big? Move the right pointer left (pick cheaper)\n3. Total too small? Move the left pointer right (pick pricier)\n4. They meet in the middle? No valid pair exists\n\nWhere else does this work?\n- Checking if a word is a palindrome (compare first and last letter)\n- Finding three numbers that sum to zero (fix one, two-pointer the rest)\n- Container with most water (move the shorter wall)\n\nWhen does it NOT work? If the array is NOT sorted. Then use a HashMap instead.",
        side:"SPOT IT IN PROBLEMS:\n\"sorted\" + \"pair\"\n\"palindrome\"\n\"two numbers that\"\n\nTRY THESE:\nLeetCode 167: Two Sum II\nLeetCode 15: 3Sum\nLeetCode 125: Valid Palindrome\nLeetCode 11: Container Water", sum:true },
    ],
  },
  {
    id:"sliding-window", name:"Sliding Window", icon:"sliders", color:"#4ECDC4",
    tagline:"A window that slides across your data",
    complexity:"O(n) · O(1) space",
    signals:["subarray","substring","contiguous","maximum sum"],
    vizType:"array-window",
    code:[
      "def max_sum_subarray(nums, k):",
      "    window_sum = sum(nums[:k])",
      "    max_sum = window_sum",
      "",
      "    for i in range(k, len(nums)):",
      "        window_sum += nums[i]",
      "        window_sum -= nums[i - k]",
      "        max_sum = max(max_sum, window_sum)",
      "",
      "    return max_sum",
    ],
    steps:[
      { hl:[0], arr:[2,1,5,1,3,2], win:null, vars:{k:3},
        note:"You are looking out of a train window that shows exactly 3 houses at a time. Each house has a number on it showing how many cookies they baked today. You want to find which group of 3 consecutive houses baked the MOST cookies.\n\nThe slow way? Stop at every position, count all 3 houses from scratch. If the train has a million houses and the window fits 1000, that is a billion operations!\n\nThe smart way? As the train moves, only ONE house leaves your view and ONE new house enters. Just update your count!",
        side:"Train window = your view\nHouses = array elements\nCookies = values\nWindow size = k = 3\n\nKey idea: when the\nwindow slides, most\nof the view STAYS\nthe same!" },
      { hl:[1,2], arr:[2,1,5,1,3,2], win:[0,2], vars:{k:3,window_sum:8,max_sum:8},
        note:"sum(nums[:k]) means: \"add up the first 3 houses.\" In Python, nums[:3] grabs items at positions 0, 1, and 2.\n\nHouses 0, 1, 2 baked 2 + 1 + 5 = 8 cookies. That is our starting count. We also set max_sum = 8 because 8 is the best we have seen so far.",
        side:"nums[:3] = first 3 items\n= [2, 1, 5]\n\nSum = 2 + 1 + 5 = 8\n\nmax_sum = 8\n(best so far)" },
      { hl:[4,5,6], arr:[2,1,5,1,3,2], win:[1,3], sOut:0, sIn:3, vars:{k:3,i:3,window_sum:7,max_sum:8},
        note:"The train moves! What happens to your view?\n\n- House 3 comes INTO view: it baked 1 cookie. We ADD it: window_sum += nums[3] means \"add the new house's cookies\"\n- House 0 LEAVES your view: it had 2 cookies. We SUBTRACT it: window_sum -= nums[0] means \"remove the house that left\"\n\nNew total: 8 + 1 - 2 = 7 cookies. We did NOT re-add houses 1 and 2. They never left our window!",
        side:"Entering: house 3 = 1 cookie\nLeaving: house 0 = 2 cookies\n\nOLD sum: 8\n+ new: 8 + 1 = 9\n- old: 9 - 2 = 7\n\nJust 2 operations,\nnot a full recount!",
        challenge:{ q:"Our window sum dropped from 8 to 7. Is 7 our new best score?", opts:["Yes, 7 is the new record","No, 8 was better and we keep that as max"], ans:1 } },
      { hl:[4,5,6,7], arr:[2,1,5,1,3,2], win:[2,4], sOut:1, sIn:4, vars:{k:3,i:4,window_sum:9,max_sum:9},
        note:"Train moves again! House 4 enters (3 cookies), house 1 leaves (1 cookie).\n\n7 + 3 - 1 = 9. That BEATS our old record of 8!\n\nmax(max_sum, window_sum) means: \"compare the old record with the new count, keep whichever is bigger.\" max(8, 9) = 9. New record!",
        side:"+ house 4: 3 cookies\n- house 1: 1 cookie\n7 + 3 - 1 = 9\n\n9 > 8 = NEW RECORD!\nmax_sum = 9" },
      { hl:[4,5,6], arr:[2,1,5,1,3,2], win:[3,5], sOut:2, sIn:5, vars:{k:3,i:5,window_sum:6,max_sum:9},
        note:"Last stop! House 5 enters (2 cookies), house 2 leaves (5 cookies). 9 + 2 - 5 = 6. Not a new record.\n\nWe checked every possible window of 3 houses and the winning group is houses 2, 3, 4 with 9 total cookies. All done in ONE pass!",
        side:"+ house 5: 2 cookies\n- house 2: 5 cookies\n9 + 2 - 5 = 6\n\n6 < 9, no new record.\nFinal answer: 9!" },
      { hl:[9], arr:[2,1,5,1,3,2], win:null, vars:{result:9},
        note:"YOUR CHEAT SHEET:\n\n1. See \"subarray\" or \"substring\" + some limit? Think SLIDING WINDOW\n2. Fixed window: size stays the same, just slides (this example)\n3. Variable window: window grows until a rule breaks, then shrinks from the left\n4. The trick: only update what CHANGED, never rebuild from scratch\n\nReal world: streaming average of stock prices, finding longest Wi-Fi coverage area, max customers in a time period.\n\nWhen does it NOT work? If the elements do not need to be NEXT TO EACH OTHER (like picking the best items from anywhere in a list). That is a different problem — use DP or Greedy.",
        side:"SPOT IT IN PROBLEMS:\n\"subarray\" \"substring\"\n\"consecutive\" \"contiguous\"\n\"longest with at most\"\n\"maximum sum of k\"\n\nTRY THESE:\nLeetCode 3: No Repeat Substr\nLeetCode 209: Min Subarray\nLeetCode 76: Min Window\nLeetCode 438: Find Anagrams", sum:true },
    ],
  },
  {
    id:"binary-search", name:"Binary Search", icon:"target", color:"#A78BFA",
    tagline:"Cut the problem in half, every time",
    complexity:"O(log n) · O(1) space",
    signals:["sorted","find minimum","search","kth element"],
    vizType:"array-bsearch",
    code:[
      "def binary_search(nums, target):",
      "    left = 0",
      "    right = len(nums) - 1",
      "",
      "    while left <= right:",
      "        mid = (left + right) // 2",
      "",
      "        if nums[mid] == target:",
      "            return mid",
      "        elif nums[mid] < target:",
      "            left = mid + 1",
      "        else:",
      "            right = mid - 1",
      "",
      "    return -1",
    ],
    steps:[
      { hl:[0], arr:[2,5,8,12,16,23,38,56,72,91], z:null, vars:{target:23},
        note:"You are playing a guessing game. Your friend thinks of a number between 1 and 100. Every time you guess, they say \"higher\" or \"lower.\"\n\nWould you guess 1, then 2, then 3? That could take 100 guesses! Instead, you guess 50. \"Higher.\" Then 75. \"Lower.\" Then 62. Each guess ELIMINATES HALF the possibilities.\n\nSame idea here: find 23 in a sorted list of 10 numbers.",
        side:"The guessing game strategy:\nAlways guess the MIDDLE.\n\nFor 10 numbers: ~4 guesses\nFor 1,000: ~10 guesses\nFor 1,000,000: ~20 guesses\nFor 1 BILLION: ~30 guesses\n\nThat is insanely fast." },
      { hl:[1,2], arr:[2,5,8,12,16,23,38,56,72,91], z:{l:0,r:9}, vars:{target:23,left:0,right:9},
        note:"left = 0 and right = 9 set up the boundaries of our guessing range. Left is the lowest possible position (0) and right is the highest (9).\n\nRight now, the answer could be ANYWHERE from position 0 to position 9. After each guess, we will chop this range in half. 10 possibilities will become 5, then 2, then 1.",
        side:"Guessing range: 0 to 9\nAll 10 numbers are\nstill in play.\n\nAfter each guess,\nhalf of them get\neliminated." },
      { hl:[4,5], arr:[2,5,8,12,16,23,38,56,72,91], z:{l:0,r:9,m:4}, vars:{target:23,mid:4,"nums[mid]":16},
        note:"mid = (0 + 9) // 2 = 4. The // means \"divide and round down\" in Python. So we look at position 4, which has the value 16.\n\nIs 16 our target 23? No. Is 16 less than 23? YES! Since the list is sorted, everything to the LEFT of 16 is even smaller. Those are all innocent — we can eliminate them all at once!",
        side:"(0 + 9) // 2 = 4\n// means divide, keep\nwhole number only\n\nnums[4] = 16\n16 < 23\n\nSo 23 must be somewhere\nto the RIGHT of position 4.",
        challenge:{ q:"We found 16 at the middle, and our target is 23. Since 16 < 23, where should we look?", opts:["Left half (smaller numbers)","Right half (bigger numbers)","Start over"], ans:1 } },
      { hl:[9,10], arr:[2,5,8,12,16,23,38,56,72,91], z:{l:5,r:9,elim:[0,4]}, vars:{target:23,left:5,right:9},
        note:"left = mid + 1 = 5. Why +1? Because we already checked position 4 and it was not our number. No point guessing the same thing twice!\n\nLook at the visualization: positions 0-4 are crossed out. We just eliminated HALF the possibilities in one guess. The range shrank from 10 numbers down to 5.",
        side:"left moves to 5\n(skip past mid)\n\nEliminated: positions 0-4\nRemaining: positions 5-9\n\n10 numbers down to 5.\nOne guess = half gone!" },
      { hl:[4,5], arr:[2,5,8,12,16,23,38,56,72,91], z:{l:5,r:9,m:7,elim:[0,4]}, vars:{target:23,mid:7,"nums[mid]":56},
        note:"New middle: (5 + 9) // 2 = 7. Value at position 7 is 56.\n\n56 is BIGGER than 23. So our number must be to the LEFT of 56. Move right to mid - 1 = 6.",
        side:"mid = 7, value = 56\n56 > 23, so go LEFT\n\nright moves to 6\n\n5 numbers down to 2!\nOnly positions 5 and 6 left." },
      { hl:[11,12], arr:[2,5,8,12,16,23,38,56,72,91], z:{l:5,r:6,elim:[0,4,7,9]}, vars:{target:23,left:5,right:6},
        note:"Our guessing range is now just positions 5 and 6. From 10 numbers down to 2 in just two guesses! One more guess will find it.",
        side:"Eliminated: 0-4 and 7-9\nStill alive: 5 and 6\n\n2 out of 10 remain.\nNext guess is the last!" },
      { hl:[4,5,7,8], arr:[2,5,8,12,16,23,38,56,72,91], z:{l:5,r:6,m:5,elim:[0,4,7,9]}, vars:{target:23,mid:5,"nums[mid]":23,result:"index 5"},
        note:"mid = (5 + 6) // 2 = 5. Value = 23. THAT IS OUR NUMBER!\n\nreturn mid means \"tell the caller: I found it at position 5.\" Only 3 guesses for 10 items. For a phone book with 1 million names, that is about 20 guesses. For all of Google (billions of pages), about 33.",
        side:"FOUND IT! Position 5.\nOnly 3 guesses needed.\n\nThink how fast that is:\n3 guesses for 10 items\n20 guesses for 1 million\n33 guesses for 8 billion" },
      { hl:[], arr:[2,5,8,12,16,23,38,56,72,91], z:null, vars:{},
        note:"YOUR CHEAT SHEET:\n\n1. See \"sorted\" + \"find something\"? Think BINARY SEARCH\n2. Always look at the MIDDLE, then eliminate half\n3. Use left = mid + 1 (not mid!) to avoid checking the same spot twice\n4. The loop runs while left <= right (with the =, because a single element still needs checking)\n\nCool trick: you can also binary search on ANSWERS! \"What is the minimum speed to finish by 5pm?\" Try middle speed, too slow? Go faster. Too fast? Go slower.\n\nWhen does it NOT work? Unsorted data. Sort it first (costs O(n log n)) or use a HashMap.",
        side:"SPOT IT IN PROBLEMS:\n\"sorted\" \"search\" \"find\"\n\"minimum speed/time that\"\n\"O(log n) required\"\n\nTRY THESE:\nLeetCode 704: Binary Search\nLeetCode 33: Search Rotated\nLeetCode 875: Koko Bananas\nLeetCode 153: Find Minimum", sum:true },
    ],
  },
  {
    id:"hashmap", name:"HashMap", icon:"database", color:"#F59E0B",
    tagline:"Instant lookups, your memory palace",
    complexity:"O(n) · O(n) space",
    signals:["frequency","count","duplicate","anagram"],
    vizType:"hashmap",
    code:[
      "def two_sum(nums, target):",
      "    seen = {}",
      "",
      "    for i, num in enumerate(nums):",
      "        complement = target - num",
      "",
      "        if complement in seen:",
      "            return [seen[complement], i]",
      "",
      "        seen[num] = i",
      "",
      "    return []",
    ],
    steps:[
      { hl:[0], arr:[2,7,11,15], hmap:{}, idx:-1, vars:{target:9},
        note:"You are at a dance party. Everyone has a number on their shirt. You need to find two people whose numbers add up to 9.\n\nYou could ask every person to stand next to every other person and check (slow!). Or... you could carry a NOTEBOOK. For each person you meet, write down their number. Before writing, check: \"Is the number I NEED already in my notebook?\"\n\nThat notebook is a HashMap — and checking it is INSTANT.",
        side:"Dance party = the array\nShirt numbers = values\nNotebook = HashMap\n\nLooking up a notebook\n= O(1), instant!\n\nCompare with scanning\nthe whole party each time\n= O(n), slow!" },
      { hl:[1], arr:[2,7,11,15], hmap:{}, idx:-1, vars:{target:9},
        note:"seen = {} creates our empty notebook. In Python, {} makes a \"dictionary\" — a list of paired info like a phone book (name: phone number). Ours will store (shirt number: where I met them).\n\nRight now the notebook is empty because we have not met anyone yet.",
        side:"seen = {} means\n\"empty notebook\"\n\nIt will store:\nnumber -> position\n\nLike a contacts list:\n\"7\" -> \"met at position 1\"" },
      { hl:[3,4], arr:[2,7,11,15], hmap:{}, idx:0, vars:{target:9,i:0,num:2,complement:7},
        note:"We meet the first person: they have 2 on their shirt (position 0 in the line).\n\nfor i, num in enumerate(nums) means: \"go through each person one by one, tracking both their POSITION (i) and their NUMBER (num).\"\n\ncomplement = 9 - 2 = 7. This means: \"I need someone with 7 on their shirt to make a pair that adds to 9.\" Do we have a 7 in our notebook? Nope — it is empty!",
        side:"enumerate gives us:\ni = 0 (position)\nnum = 2 (shirt number)\n\ncomplement = 9 - 2 = 7\n\"I need a 7!\"\n\nIs 7 in our notebook?\nNotebook is empty, so NO." },
      { hl:[9], arr:[2,7,11,15], hmap:{2:0}, idx:0, vars:{target:9,i:0,num:2},
        note:"No match found, so we write this person down: seen[2] = 0 means \"I saw the number 2 at position 0.\"\n\nWhy bother writing it down? Because someone we meet LATER might need a 2! By recording everyone we pass, we never have to go back and look for them again.",
        side:"Write in notebook:\n\"2\" -> position 0\n\nseen = {2: 0}\n\nThis is the magic:\nwe build the notebook\nAS WE WALK through\nthe party.",
        challenge:{ q:"We wrote down that person 2 is at position 0. Why?", opts:["Just for fun","A future person might need 2 to complete their pair!","To count how many 2s there are"], ans:1 } },
      { hl:[3,4,6,7], arr:[2,7,11,15], hmap:{2:0}, idx:1, vars:{target:9,i:1,num:7,complement:2,result:"[0, 1]"},
        note:"Next person: shirt number 7, position 1.\n\ncomplement = 9 - 7 = 2. \"I need a 2!\" Let me check my notebook... YES! I have a 2, and I met them at position 0!\n\nreturn [seen[complement], i] means: \"The answer is [position of the 2, position of the 7]\" = [0, 1]. We are done!\n\nWe met only 2 people out of 4. The notebook saved us from having to go back to the start.",
        side:"Person 7 needs a 2.\nCheck notebook: YES!\nseen[2] = 0\n\nReturn [0, 1]\n= positions of 2 and 7\n\nOnly 2 steps, not 6\npossible pairs!" },
      { hl:[], arr:[2,7,11,15], hmap:{}, idx:-1, vars:{},
        note:"YOUR CHEAT SHEET:\n\n1. Need to check \"have I seen this before?\" FAST? Use a HashMap\n2. For \"find a pair\" problems: calculate what you NEED, check if it exists\n3. Build the HashMap as you go — one pass through the data\n4. HashMap = instant lookup but uses extra memory\n\nWhere else? Counting how many times each word appears in a text, grouping anagrams together, finding duplicates in a list.\n\nWhen does it NOT work? When memory is super tight (HashMap stores everything). If data is sorted, Two Pointers uses zero extra memory.",
        side:"SPOT IT IN PROBLEMS:\n\"frequency\" \"count\"\n\"duplicate\" \"anagram\"\n\"two sum\" (unsorted)\n\nTRY THESE:\nLeetCode 1: Two Sum\nLeetCode 49: Group Anagrams\nLeetCode 347: Top K Frequent\nLeetCode 242: Valid Anagram", sum:true },
    ],
  },
  {
    id:"stack", name:"Stack", icon:"layers", color:"#EC4899",
    tagline:"Last in, first out, like stacking plates",
    complexity:"O(n) · O(n) space",
    signals:["parentheses","brackets","next greater","nested"],
    vizType:"stack",
    code:[
      "def valid_parentheses(s):",
      "    stack = []",
      "    pairs = {')':'(', '}':'{', ']':'['}",
      "",
      "    for char in s:",
      "        if char in '({[':",
      "            stack.append(char)",
      "        elif char in ')}]':",
      "            if not stack:",
      "                return False",
      "            if stack[-1] != pairs[char]:",
      "                return False",
      "            stack.pop()",
      "",
      "    return len(stack) == 0",
    ],
    steps:[
      { hl:[0], stk:[], input:["{","[","(",")","]}"], inIdx:-1, vars:{},
        note:"You know how you put on clothes in the morning? Shirt first, then jacket, then scarf. When you come home, you take off the scarf FIRST, then jacket, then shirt. The LAST thing you put on is the FIRST thing you take off.\n\nThat is a stack! And it is perfect for checking if brackets match. {[()]} is valid because every \"opening\" bracket gets \"closed\" in the REVERSE order it was opened.",
        side:"Getting dressed:\nShirt -> Jacket -> Scarf\n\nUndressing:\nScarf -> Jacket -> Shirt\n\nLast on = First off\n= STACK" },
      { hl:[4,5,6], stk:["{"], input:["{","[","(",")","]","}"], inIdx:0, vars:{char:"{"},
        note:"We read '{' — it is an opener, like putting on a shirt.\n\nstack.append(char) means: \"put this bracket on top of our pile.\" In Python, append adds something to the END of a list. Since we always look at the end, it works like the top of a pile.\n\nOur pile now has one item: {",
        side:"Read: {\nIs it an opener? YES!\n\nappend = put on top\n\nPile: [ { ]\n\nLike putting on a shirt.\nNow waiting for matching }" },
      { hl:[4,5,6], stk:["{","["], input:["{","[","(",")","]","}"], inIdx:1, vars:{char:"["},
        note:"Read '[' — another opener! Put it on top of the pile.\n\nPile is now: { on the bottom, [ on top. Just like wearing a shirt then putting a jacket on top. The jacket (latest item) has to come off before the shirt.",
        side:"Read: [\nOpener -> put on top\n\nPile: [ {  [ ]\n\nShirt = {\nJacket = [\nJacket must come off\nbefore shirt!" },
      { hl:[4,5,6], stk:["{","[","("], input:["{","[","(",")","]","}"], inIdx:2, vars:{char:"("},
        note:"Read '(' — yep, another opener. On the pile it goes! Three layers deep now.\n\nThe pile perfectly tracks the order we opened things. The TOP of the pile is always whatever we opened MOST RECENTLY. That is what we need to close next.",
        side:"Read: (\nOpener -> put on top\n\nPile: [ {  [  ( ]\n\nShirt { -> Jacket [ ->\nScarf (\n\nScarf must come off first!" },
      { hl:[4,7,10,12], stk:["{","["], input:["{","[","(",")","]","}"], inIdx:3, vars:{char:")","top":"("},
        note:"Read ')' — a CLOSER! Time to undress!\n\nstack[-1] means \"look at the TOP of the pile\" — in Python, -1 means the last item. The top is '('.\n\nDoes ')' match '('? Our pairs dictionary says yes! So stack.pop() means: \"take the top item OFF the pile.\" Like taking off the scarf. The ( and ) are now matched!\n\nIf it did NOT match (like finding a ']' when the top is '('), that is like trying to take off your jacket before your scarf — wrong order! Return False.",
        side:"Read: )\nCloser! Check the top.\n\nstack[-1] = (\n(top of pile = last item)\n\n) matches ( ? YES!\n\npop() = take it off!\nLike removing the scarf.\n\nPile: [ {  [ ]",
        challenge:{ q:"We see ')' and the top of our pile is '('. What do we do?", opts:["Put ')' on the pile too","Take '(' off — it matches!","Something is wrong, return False"], ans:1 } },
      { hl:[4,7,10,12], stk:["{"], input:["{","[","(",")","]","}"], inIdx:4, vars:{char:"]","top":"["},
        note:"Read ']' — closer! Top of pile is '['. They match! Pop it off (take off the jacket).\n\nSee the beautiful pattern? We put on {, [, ( and now we are taking off ), ], } — the EXACT reverse order. That is why a stack is perfect here.",
        side:"Read: ]\nTop = [, match!\npop() = remove it\n\nPile: [ { ]\n\nPut on: { [ (\nTaking off: ) ] }\nPerfect reverse!" },
      { hl:[4,7,10,12], stk:[], input:["{","[","(",")","]","}"], inIdx:5, vars:{char:"}","top":"{"},
        note:"Read '}' — closer! Top = '{'. Match! Pop! The pile is now COMPLETELY EMPTY.\n\nEmpty pile = every bracket that was opened got properly closed. Like coming home and all your clothes are in the hamper.",
        side:"Read: }\nTop = {, match!\npop() = remove it\n\nPile: [ ] EMPTY!\n\nAll clothes removed\nin correct order!" },
      { hl:[14], stk:[], input:["{","[","(",")","]","}"], inIdx:6, vars:{result:"True"},
        note:"YOUR CHEAT SHEET:\n\n1. See \"nested\" or \"matching\" or \"brackets\"? Think STACK\n2. Openers go ON the pile (append)\n3. Closers: check the top (-1), remove if match (pop)\n4. At the end, pile should be empty\n\nWhere else? Undo button (stack of actions), back button in browser (stack of pages), evaluating math expressions like 3 + (4 * 2).\n\nMemory hook: if something needs to be processed in REVERSE order of how it was added, that is a stack.",
        side:"SPOT IT IN PROBLEMS:\n\"valid parentheses\"\n\"matching brackets\"\n\"next greater element\"\n\"undo\" \"reverse\"\n\nTRY THESE:\nLeetCode 20: Valid Parens\nLeetCode 155: Min Stack\nLeetCode 739: Daily Temps\nLeetCode 84: Largest Rect", sum:true },
    ],
  },
  {
    id:"bfs", name:"BFS / Level Order", icon:"network", color:"#06B6D4",
    tagline:"Ripples in a pond, layer by layer",
    complexity:"O(V+E) · O(V) space",
    signals:["shortest path","level order","minimum steps"],
    vizType:"grid",
    code:[
      "from collections import deque",
      "",
      "def bfs_shortest(graph, start, end):",
      "    queue = deque([(start, 0)])",
      "    visited = {start}",
      "",
      "    while queue:",
      "        node, dist = queue.popleft()",
      "",
      "        if node == end:",
      "            return dist",
      "",
      "        for neighbor in graph[node]:",
      "            if neighbor not in visited:",
      "                visited.add(neighbor)",
      "                queue.append((neighbor, dist+1))",
      "",
      "    return -1",
    ],
    steps:[
      { hl:[2], grid:{nodes:["A","B","C","D","E"],edges:[["A","B"],["A","C"],["B","D"],["C","D"],["D","E"]],visited:[],queue:[],current:null},
        vars:{start:"A",end:"E"},
        note:"You are standing at subway station A. You need to reach station E using the FEWEST stops possible.\n\nYou could just pick a random train and hope for the best, but you might end up on the scenic route. Instead, here is the plan: first, check every station that is exactly 1 stop away. Then check every station 2 stops away. Then 3. The FIRST time you spot station E, you KNOW that is the shortest route, because you already checked all shorter distances.\n\nThis is BFS: exploring outward one ring at a time, like announcements on a subway PA system reaching nearby stations first.",
        side:"Subway map:\nA connects to B, C\nB connects to D\nC connects to D\nD connects to E\n\nFind shortest: A to E\n\nRing 0: A (you are here)\nRing 1: B, C (1 stop)\nRing 2: D (2 stops)\nRing 3: E (3 stops)" },
      { hl:[3,4], grid:{nodes:["A","B","C","D","E"],edges:[["A","B"],["A","C"],["B","D"],["C","D"],["D","E"]],visited:["A"],queue:["A(0)"],current:null},
        vars:{queue:"[A(0)]",visited:"{A}"},
        note:"We set up two things:\n\n1. A QUEUE — think of it as a list of stations to visit, in order. Stations that are closer go first. We start by writing down: \"Visit station A, which is 0 stops away.\" In Python, deque is a special list that is fast at adding to the back and removing from the front.\n\n2. A VISITED list — we mark station A as \"already explored\" so we never waste time coming back to it. Without this, we could go A -> B -> D -> ... -> A and loop forever!",
        side:"Queue (to-visit list):\n[A at 0 stops]\n\nVisited (explored):\n{A}\n\nQueue = which station next\nVisited = do not revisit" },
      { hl:[6,7], grid:{nodes:["A","B","C","D","E"],edges:[["A","B"],["A","C"],["B","D"],["C","D"],["D","E"]],visited:["A"],queue:[],current:"A"},
        vars:{node:"A",dist:0},
        note:"We take the FIRST station from our to-visit list: station A, 0 stops away.\n\nqueue.popleft() means: \"grab and remove the station at the front of the list.\" The front, not the back! This is key — stations that were added earlier (closer ones) always get checked first.\n\nIs A our destination E? Nope. So let us look at the subway map and see which stations A is directly connected to.",
        side:"Take from front:\nA at 0 stops.\n\nA == E? No.\n\nLet us check A's\nneighboring stations." },
      { hl:[12,13,14,15], grid:{nodes:["A","B","C","D","E"],edges:[["A","B"],["A","C"],["B","D"],["C","D"],["D","E"]],visited:["A","B","C"],queue:["B(1)","C(1)"],current:"A"},
        vars:{node:"A",neighbors:"B, C",queue:"[B(1), C(1)]"},
        note:"The subway map says A connects to B and C. For each one we do three things:\n\n1. Have we explored this station already? B is not in our visited list, so no.\n2. Mark it as visited so we never add it again.\n3. Add it to the BACK of our to-visit list with distance 0 + 1 = 1 stop.\n\nSame for C. Now our to-visit list is: [B at 1 stop, C at 1 stop]. Both are ring 1 — one stop from A. They go to the BACK, so everything closer gets checked first.",
        side:"A's neighbors: B, C\n\nB: new? Yes -> visit later\nC: new? Yes -> visit later\n\nTo-visit list:\n[B(1 stop), C(1 stop)]\n\nBoth at ring 1.",
        challenge:{ q:"B and C are both in the to-visit list. Which station do we check first?", opts:["C (was added last)","B (was added first — first in, first out!)","Whichever is closer to E"], ans:1 } },
      { hl:[6,7,12,13,14,15], grid:{nodes:["A","B","C","D","E"],edges:[["A","B"],["A","C"],["B","D"],["C","D"],["D","E"]],visited:["A","B","C","D"],queue:["C(1)","D(2)"],current:"B"},
        vars:{node:"B",dist:1,queue:"[C(1), D(2)]"},
        note:"Take B from the front of the list (1 stop away). Is B our target E? No.\n\nB connects to D. D is new (not yet visited), so mark it visited and add it to the BACK of the list with distance 1 + 1 = 2 stops.\n\nTo-visit list is now: [C(1 stop), D(2 stops)]. C will be checked BEFORE D because C was added first. This naturally keeps the order: all 1-stop stations before any 2-stop stations!",
        side:"Take: B (1 stop)\nB connects to: D\nD is new -> add at 2 stops\n\nTo-visit: [C(1), D(2)]\nC goes first because\nit was added earlier." },
      { hl:[6,7], grid:{nodes:["A","B","C","D","E"],edges:[["A","B"],["A","C"],["B","D"],["C","D"],["D","E"]],visited:["A","B","C","D"],queue:["D(2)"],current:"C"},
        vars:{node:"C",dist:1},
        note:"Take C from the front (1 stop). Not our target. C connects to D, but D is already in our visited list! We skip it.\n\nThis is why the visited list matters. Without it, we would add D a second time and waste effort (or worse, loop forever in a circular subway line).",
        side:"Take: C (1 stop)\nC connects to: D\nD already visited -> SKIP\n\nTo-visit: [D(2)]\nNo duplicates!" },
      { hl:[6,7,12,13,14,15], grid:{nodes:["A","B","C","D","E"],edges:[["A","B"],["A","C"],["B","D"],["C","D"],["D","E"]],visited:["A","B","C","D","E"],queue:["E(3)"],current:"D"},
        vars:{node:"D",dist:2,queue:"[E(3)]"},
        note:"Take D (2 stops). Not target. D connects to E. E is new, mark it and add at distance 2 + 1 = 3 stops.",
        side:"Take: D (2 stops)\nD connects to: E\nE is new -> add at 3 stops\n\nAlmost there!" },
      { hl:[6,7,9,10], grid:{nodes:["A","B","C","D","E"],edges:[["A","B"],["A","C"],["B","D"],["C","D"],["D","E"]],visited:["A","B","C","D","E"],queue:[],current:"E"},
        vars:{node:"E",dist:3,result:"3"},
        note:"YOUR CHEAT SHEET:\n\n1. Need SHORTEST route or MINIMUM steps? Think BFS\n2. Keep a TO-VISIT list (queue) — always check the front first (first in, first out)\n3. Keep a VISITED list — never explore the same station twice\n4. The first time you reach the destination = shortest route, guaranteed\n\nWhere else? Finding how many moves to solve a Rubik's cube, figuring out degrees of separation on LinkedIn, how many steps to escape a maze.\n\nBFS vs DFS: BFS = shortest path (explores wide, ring by ring). DFS = explores one path all the way down (good for \"does ANY path exist?\" or \"find ALL paths\").",
        side:"SPOT IT IN PROBLEMS:\n\"shortest path\" \"fewest\"\n\"minimum steps\" \"nearest\"\n\"level order\" \"layer\"\n\nTRY THESE:\nLeetCode 102: Level Order\nLeetCode 200: Num Islands\nLeetCode 994: Rotting Oranges\nLeetCode 127: Word Ladder", sum:true },
    ],
  },
  {
    id:"dfs", name:"DFS / Backtracking", icon:"git-branch", color:"#8B5CF6",
    tagline:"Explore deep, backtrack, try again",
    complexity:"O(2^n) · O(n) space",
    signals:["all combinations","permutations","subsets"],
    vizType:"tree",
    code:[
      "def subsets(nums):",
      "    result = []",
      "",
      "    def backtrack(start, current):",
      "        result.append(current[:])",
      "",
      "        for i in range(start, len(nums)):",
      "            current.append(nums[i])",
      "            backtrack(i + 1, current)",
      "            current.pop()",
      "",
      "    backtrack(0, [])",
      "    return result",
    ],
    steps:[
      { hl:[0,1], tree:null, vars:{nums:"[1, 2, 3]"},
        note:"You are building pizza topping combinations from 3 toppings: Pepperoni (1), Mushroom (2), Olive (3).\n\nYou want EVERY possible combination: plain, just pepperoni, pepperoni + mushroom, all three, etc. How many? For 3 toppings, it is 2 x 2 x 2 = 8 (each topping is either ON or OFF the pizza).\n\nThe strategy: for each topping, try it ON, explore further, then take it OFF and try the next topping. This is BACKTRACKING — making a choice, exploring, then UNDOING that choice to try something else.",
        side:"Pizza toppings:\n1 = Pepperoni\n2 = Mushroom\n3 = Olive\n\nEach topping: on or off\n2 x 2 x 2 = 8 combos\n\nStrategy:\nPut topping ON\nTry more toppings\nTake it OFF\nTry next topping" },
      { hl:[11,3,4], tree:{path:["[]"],active:"[]"}, vars:{start:0,current:"[]"},
        note:"result.append(current[:]) means: \"save a PHOTO of the current pizza.\" Why current[:]? In Python, lists are like whiteboards — if you save a reference, it changes when the whiteboard changes. The [:] makes a copy, like taking a photo.\n\nFirst photo: an empty pizza (no toppings). That IS a valid subset! We have 1 combination saved.",
        side:"current[:] = take a photo\n(make a copy)\n\nWhy copy?\nThe list will CHANGE later.\nWithout [:], we would\nsave a link to the\nchanging whiteboard,\nnot a snapshot.\n\nResult: [ [] ]" },
      { hl:[6,7,8], tree:{path:["[]","[1]"],active:"[1]"}, vars:{i:0,current:"[1]"},
        note:"current.append(nums[0]) means: \"put pepperoni ON the pizza.\"\n\nappend = add to the end of the list. Our pizza now has [1] (pepperoni). Save a photo. Then backtrack(1, current) means: \"now try adding mushroom and olive to this pepperoni pizza.\"",
        side:"PUT ON: Pepperoni (1)\nPizza: [1]\nSave photo!\n\nNow explore: what else\ncan we add to a\npepperoni pizza?" },
      { hl:[6,7,8], tree:{path:["[]","[1]","[1,2]"],active:"[1,2]"}, vars:{i:1,current:"[1, 2]"},
        note:"Still building on the pepperoni pizza. append mushroom (2). Pizza is now [1, 2]. Save photo.\n\nNext: try adding olive to make [1, 2, 3].",
        side:"PUT ON: Mushroom (2)\nPizza: [1, 2]\nSave photo!\n\nNext: try olive on top.",
        challenge:{ q:"We have pizza [1,2]. After trying [1,2,3], what happens next?", opts:["We are done","We REMOVE olive, then mushroom, then try [1,3] — that is backtracking!","We start a new pizza from scratch"], ans:1 } },
      { hl:[6,7,8], tree:{path:["[]","[1]","[1,2]","[1,2,3]"],active:"[1,2,3]"}, vars:{i:2,current:"[1, 2, 3]"},
        note:"Add olive (3). Pizza is [1, 2, 3] — the supreme! Save photo. No more toppings to try.\n\nNow comes the backtracking...",
        side:"PUT ON: Olive (3)\nPizza: [1, 2, 3]\nSave photo!\n\nNo more toppings.\nTime to BACKTRACK!" },
      { hl:[9], tree:{path:["[]","[1]","[1,2]","back"],active:"[1,2]"}, vars:{current:"[1, 2]",popped:3},
        note:"current.pop() means: \"TAKE OFF the last topping.\" pop() removes and returns the last item from a list.\n\nTake off olive -> back to [1, 2]. Take off mushroom -> back to [1]. NOW, instead of mushroom, try olive directly -> [1, 3]! This is a combo we would not have found by only going deeper.\n\nThis is the MAGIC of backtracking: by UNDOING choices, we explore every possible branch.",
        side:"pop() = remove last item\n\nTake off 3: [1,2] -> [1,2]\nWait, already saved [1,2].\nTake off 2: [1,2] -> [1]\n\nTry 3 instead of 2:\nPizza: [1, 3]\nSave photo!\n\nNew combo discovered!" },
      { hl:[9], tree:{path:["[]","[1]","[1,3]","back","[2]","[2,3]","[3]"],active:"done"}, vars:{current:"[]"},
        note:"The full menu of exploration:\nPlain [] -> Pepperoni [1] -> Pep+Mush [1,2] -> Supreme [1,2,3] -> backtrack -> Pep+Olive [1,3] -> backtrack -> Mushroom [2] -> Mush+Olive [2,3] -> backtrack -> Olive [3]\n\nAll 8 combos found! The choose-explore-undo cycle guarantees we never miss a combination and never repeat one.",
        side:"All 8 pizza combos:\nPlain, Pepperoni,\nPep+Mush, Supreme,\nPep+Olive, Mushroom,\nMush+Olive, Olive\n\n2^3 = 8. Every combo!" },
      { hl:[], tree:null, vars:{},
        note:"YOUR CHEAT SHEET:\n\n1. See \"all combinations\" or \"every possible\"? Think BACKTRACKING\n2. The recipe: PUT ON (append) -> EXPLORE (recurse) -> TAKE OFF (pop)\n3. Use a start index to avoid duplicates (do not go backwards)\n4. Always save a COPY ([:]) not the list itself\n\nSame recipe works for: permutations (rearrangements), N-Queens, Sudoku solver, word search in a grid.\n\nWhen NOT to use: when you need the BEST answer only (use DP). When you need the shortest path (use BFS). Backtracking is for when you need EVERY possibility.",
        side:"SPOT IT IN PROBLEMS:\n\"all combinations\"\n\"generate all\" \"subsets\"\n\"permutations\"\n\nTRY THESE:\nLeetCode 78: Subsets\nLeetCode 46: Permutations\nLeetCode 39: Combination Sum\nLeetCode 79: Word Search", sum:true },
    ],
  },
  {
    id:"dp", name:"Dynamic Programming", icon:"lightbulb", color:"#10B981",
    tagline:"Organized laziness, never solve twice",
    complexity:"O(n) · O(1) space",
    signals:["minimum cost","number of ways","longest"],
    vizType:"dp-table",
    code:[
      "def climb_stairs(n):",
      "    if n <= 2: return n",
      "",
      "    prev2, prev1 = 1, 2",
      "",
      "    for i in range(3, n + 1):",
      "        current = prev1 + prev2",
      "        prev2 = prev1",
      "        prev1 = current",
      "",
      "    return prev1",
    ],
    steps:[
      { hl:[0], dpArr:null, vars:{n:5},
        note:"You are climbing a staircase of 5 steps. Each time, you can jump 1 step OR 2 steps. How many different ways can you reach the top?\n\nYour first instinct: try every possibility! But for 5 steps, there are 8 ways. For 10 steps, 89 ways. For 40 steps, over 100 MILLION ways. Trying them all is insane.\n\nThe trick: if you KNOW the answer for 3 steps and 4 steps, you can instantly get the answer for 5 steps. Why? Because the only way to reach step 5 is from step 4 (jump 1) or step 3 (jump 2). So ways(5) = ways(4) + ways(3). This is DP — solving tiny problems first and REUSING their answers.",
        side:"Staircase = the problem\nSteps = sub-problems\n\nKey idea:\nTo reach step 5,\nyou came from step 4\nor step 3.\n\nSo ways(5) =\nways(4) + ways(3)\n\nThis is the FORMULA." },
      { hl:[1], dpArr:[{n:1,val:1,active:true},{n:2,val:2,active:true}], vars:{n:5},
        note:"Start with what we KNOW for sure:\n- 1 step: only 1 way (just step up once)\n- 2 steps: 2 ways (step+step, or one big jump)\n\nif n <= 2: return n means: \"if the staircase is 1 or 2 steps, the answer is just that number.\" These are our foundation blocks. Everything else builds on them.",
        side:"1 step: [1] = 1 way\n2 steps: [1,1] or [2]\n= 2 ways\n\nThese are KNOWN.\nNo calculation needed.\nWe build from here." },
      { hl:[3], dpArr:[{n:1,val:1},{n:2,val:2,active:true}], vars:{prev2:1,prev1:2},
        note:"prev2 = 1 and prev1 = 2. These are like sticky notes:\n- prev2 remembers \"2 steps ago\" (stair 1: 1 way)\n- prev1 remembers \"1 step ago\" (stair 2: 2 ways)\n\nWhy only 2 sticky notes and not a whole notebook? Because our formula ways(n) = ways(n-1) + ways(n-2) only EVER looks at the last two answers. Everything older is useless. Two sticky notes = zero wasted memory!",
        side:"prev2 = 1 (stair 1)\nprev1 = 2 (stair 2)\n\nOnly 2 sticky notes!\nNot an array of 5.\n\nWhy? Our formula only\nneeds the last TWO\nanswers. Old ones\nare not needed." },
      { hl:[5,6,7,8], dpArr:[{n:1,val:1},{n:2,val:2},{n:3,val:3,active:true}], vars:{i:3,current:3,prev2:2,prev1:3},
        note:"Stair 3: current = prev1 + prev2 = 2 + 1 = 3 ways.\n\nThen we SLIDE our sticky notes forward:\n- prev2 = prev1 (old \"1 step ago\" becomes \"2 steps ago\")\n- prev1 = current (the answer we just found becomes \"1 step ago\")\n\nIt is like a caterpillar crawling forward — always moving but only touching 2 spots at a time.",
        side:"Stair 3: 2 + 1 = 3 ways\n[1,1,1] [1,2] [2,1]\n\nSlide sticky notes:\nprev2: 1 -> 2\nprev1: 2 -> 3\n\nReady for stair 4!",
        challenge:{ q:"We know stair 3 = 3 ways and stair 2 = 2 ways. What is stair 4?", opts:["4 ways","5 ways (3 + 2 = 5)","6 ways","3 ways"], ans:1 } },
      { hl:[5,6,7,8], dpArr:[{n:1,val:1},{n:2,val:2},{n:3,val:3},{n:4,val:5,active:true}], vars:{i:4,current:5,prev2:3,prev1:5},
        note:"Stair 4: 3 + 2 = 5 ways. Slide sticky notes forward again.\n\nNotice something? 1, 2, 3, 5... that is the Fibonacci sequence! Stair climbing IS Fibonacci in disguise. Many DP problems are secretly a famous sequence.",
        side:"Stair 4: 3 + 2 = 5\n\n1, 2, 3, 5...\nThat is Fibonacci!\n\nMany DP problems are\nfamous sequences in\ndisguise." },
      { hl:[5,6,7,8], dpArr:[{n:1,val:1},{n:2,val:2},{n:3,val:3},{n:4,val:5},{n:5,val:8,active:true}], vars:{i:5,current:8,prev2:5,prev1:8},
        note:"Stair 5: 5 + 3 = 8 ways! Done!\n\nWe computed this in 5 simple additions. Without DP, the recursive approach recalculates the same stairs over and over — for stair 40, that is over 100 million unnecessary recalculations. With DP? Just 40 additions.",
        side:"Stair 5: 5 + 3 = 8!\n\n5 additions total.\n\nRecursive without DP:\nStair 5: 15 calls\nStair 10: 177 calls\nStair 40: 100,000,000+\n\nWith DP: always just n." },
      { hl:[10], dpArr:[{n:1,val:1},{n:2,val:2},{n:3,val:3},{n:4,val:5},{n:5,val:8}], vars:{result:8},
        note:"YOUR CHEAT SHEET:\n\n1. Can the big answer be built from SMALLER answers? Think DP\n2. Step 1: find the FORMULA (how does step n relate to earlier steps?)\n3. Step 2: find BASE CASES (the tiniest problems you know by heart)\n4. Step 3: build UP from small to big\n5. Bonus: can you use just a few sticky notes instead of a whole notebook?\n\nReal world: cheapest flight with stops, longest common text between two documents, minimum edits to fix a typo.\n\nWhen NOT to use: if each sub-problem is unique (no repeats), plain recursion is fine. If you need ALL solutions (not just the best), use backtracking.",
        side:"SPOT IT IN PROBLEMS:\n\"minimum cost\"\n\"number of ways\"\n\"longest subsequence\"\n\"can you reach\"\n\nTRY THESE:\nLeetCode 70: Climb Stairs\nLeetCode 198: House Robber\nLeetCode 300: Longest Incr Sub\nLeetCode 322: Coin Change", sum:true },
    ],
  },
  {
    id:"greedy", name:"Greedy", icon:"zap", color:"#F97316",
    tagline:"Always take the best option right now",
    complexity:"O(n log n) · O(n) space",
    signals:["intervals","schedule","merge","minimum number"],
    vizType:"intervals",
    code:[
      "def merge_intervals(intervals):",
      "    intervals.sort(key=lambda x: x[0])",
      "    merged = [intervals[0]]",
      "",
      "    for start, end in intervals[1:]:",
      "        if start <= merged[-1][1]:",
      "            merged[-1][1] = max(merged[-1][1], end)",
      "        else:",
      "            merged.append([start, end])",
      "",
      "    return merged",
    ],
    steps:[
      { hl:[0], ivals:[[1,3],[2,6],[8,10],[15,18]], merged:[], vars:{},
        note:"You are a meeting room coordinator. Four meetings are booked:\n- Meeting A: 1pm-3pm\n- Meeting B: 2pm-6pm\n- Meeting C: 8pm-10pm\n- Meeting D: 3pm-6pm (wait, this is really [15,18] but imagine hours)\n\nSome of these OVERLAP (A and B share 2-3pm). Your job: merge overlapping meetings into single time blocks.\n\nThe greedy trick: SORT by start time, then walk through and merge as you go. Simple, local decisions = globally correct answer.",
        side:"Meetings as intervals:\n[1,3] [2,6] [8,10] [15,18]\n\nSome overlap!\n\nStrategy:\n1. Sort by start time\n2. Walk through\n3. Overlap? Merge!\n4. No overlap? New block." },
      { hl:[1,2], ivals:[[1,3],[2,6],[8,10],[15,18]], merged:[[1,3]], vars:{merged:"[[1,3]]"},
        note:"intervals.sort(key=lambda x: x[0]) means: \"sort all meetings by their START time.\" lambda is Python's way of saying \"a tiny throwaway function\" — here it grabs the first number (x[0]) from each meeting.\n\nAfter sorting, meetings are in chronological order. We start our merged list with the first meeting: [1, 3].",
        side:"Sort by start time.\n(Already sorted here)\n\nStart with first meeting:\nmerged = [[1, 3]]\n\nNow walk through the\nrest one by one." },
      { hl:[4,5,6], ivals:[[1,3],[2,6],[8,10],[15,18]], merged:[[1,6]], activeI:1, vars:{start:2,end:6},
        note:"Next meeting: [2, 6]. Does it overlap with our last merged block [1, 3]?\n\nstart <= merged[-1][1] means: \"does the new meeting start BEFORE the last one ends?\" 2 <= 3? YES! They overlap (the new meeting starts while the old one is still going).\n\nSo we merge them: keep the earlier start (1), use whichever ends LATER: max(3, 6) = 6. Result: [1, 6].",
        side:"New: [2, 6]\nLast merged: [1, 3]\n\nDoes 2 start before 3 ends?\n2 <= 3 -> YES, overlap!\n\nMerge: [1, max(3,6)]\n= [1, 6]\n\nTwo meetings became one\ntime block.",
        challenge:{ q:"[1,3] and [2,6] overlap because meeting B starts before A ends. What about [1,6] and [8,10]?", opts:["They overlap","They do NOT overlap (8 starts after 6 ends)"], ans:1 } },
      { hl:[4,7,8], ivals:[[1,3],[2,6],[8,10],[15,18]], merged:[[1,6],[8,10]], activeI:2, vars:{start:8,end:10},
        note:"Next: [8, 10]. Does 8 start before 6 ends? 8 <= 6? NO! There is a gap.\n\nmerged.append([start, end]) means: \"this meeting does not overlap, so add it as a SEPARATE block.\" No merging needed.",
        side:"New: [8, 10]\nLast merged: [1, 6]\n\n8 > 6 -> NO overlap!\nGap from 6 to 8.\n\nAdd as new block.\nmerged: [[1,6], [8,10]]" },
      { hl:[4,7,8], ivals:[[1,3],[2,6],[8,10],[15,18]], merged:[[1,6],[8,10],[15,18]], activeI:3, vars:{start:15,end:18},
        note:"Last one: [15, 18]. Overlap with [8, 10]? 15 > 10, so no. Add separately.\n\nFinal result: [[1,6], [8,10], [15,18]]. Four meetings collapsed into three time blocks!",
        side:"15 > 10 -> no overlap\nAdd as new block.\n\nFinal:\n[[1,6], [8,10], [15,18]]\n\n4 meetings -> 3 blocks." },
      { hl:[10], ivals:null, merged:[[1,6],[8,10],[15,18]], vars:{result:"[[1,6],[8,10],[15,18]]"},
        note:"YOUR CHEAT SHEET:\n\n1. See \"intervals\" or \"schedule\"? Sort first, then Greedy\n2. Greedy = make the best LOCAL choice at each step\n3. For intervals: overlap? merge. No overlap? new group\n4. Sorting makes adjacent items the only ones that CAN overlap\n\nBIG WARNING: Greedy does NOT always work! For Coin Change, greedy picks the biggest coin first but misses better combos. Use DP when future choices affect current ones.\n\nReal world: merging calendar events, scheduling conference rooms, figuring out minimum platforms at a train station.",
        side:"SPOT IT IN PROBLEMS:\n\"intervals\" \"schedule\"\n\"merge\" \"overlap\"\n\"minimum rooms\"\n\nTRY THESE:\nLeetCode 56: Merge Intervals\nLeetCode 55: Jump Game\nLeetCode 435: Non-overlapping\nLeetCode 452: Min Arrows", sum:true },
    ],
  },
  {
    id:"fast-slow", name:"Fast and Slow Ptrs", icon:"gauge", color:"#EF4444",
    tagline:"Tortoise and hare, they meet in cycles",
    complexity:"O(n) · O(1) space",
    signals:["cycle","linked list","middle","circular"],
    vizType:"linkedlist",
    code:[
      "def has_cycle(head):",
      "    slow = fast = head",
      "",
      "    while fast and fast.next:",
      "        slow = slow.next",
      "        fast = fast.next.next",
      "",
      "        if slow == fast:",
      "            return True",
      "",
      "    return False",
    ],
    steps:[
      { hl:[0], nodes:["1","2","3","4"], slow:-1, fast:-1, vars:{},
        note:"Imagine a circular running track. You suspect some part of the path loops back on itself. Two runners start at the same point:\n- The TORTOISE runs slowly (1 step at a time)\n- The HARE runs fast (2 steps at a time)\n\nIf the track has a loop, the hare will eventually LAP the tortoise and they will be at the SAME spot. If there is NO loop, the hare reaches the end first.\n\nHere, node 4 points back to node 2, creating a loop!",
        side:"Linked list:\n1 -> 2 -> 3 -> 4 -> back to 2\n\nThat is a CYCLE!\n\nTortoise: 1 step/round\nHare: 2 steps/round\n\nIf cycle exists,\nhare laps tortoise.\nThey MEET." },
      { hl:[1], nodes:["1","2","3","4"], slow:0, fast:0, vars:{slow:"node 1",fast:"node 1"},
        note:"slow = fast = head means: \"both runners start at the beginning (node 1).\"\n\nIn Python, you can set two variables at once like this. Both now point to the first node.",
        side:"Both start at node 1.\n\nTortoise: node 1\nHare: node 1\n\nRace begins!" },
      { hl:[3,4,5], nodes:["1","2","3","4"], slow:1, fast:2, vars:{slow:"node 2",fast:"node 3"},
        note:"while fast and fast.next means: \"keep running as long as the hare has not fallen off the track.\" If there is no loop, the hare reaches the end (null) and we stop.\n\nslow = slow.next means: \"tortoise takes 1 step\" (node 1 -> node 2)\nfast = fast.next.next means: \"hare takes 2 steps\" (node 1 -> node 2 -> node 3)\n\nAre they at the same node? Tortoise is at 2, hare is at 3. Not yet!",
        side:"Round 1:\nTortoise: 1 -> 2 (1 step)\nHare: 1 -> 2 -> 3 (2 steps)\n\nSame node? No.\nTortoise at 2.\nHare at 3." },
      { hl:[3,4,5], nodes:["1","2","3","4"], slow:2, fast:0, vars:{slow:"node 3",fast:"node 2 (cycled)"},
        note:"Round 2:\n- Tortoise: node 2 -> node 3 (1 step)\n- Hare: node 3 -> node 4 -> node 2 (2 steps, went through the loop!)\n\nThe hare has gone through the cycle! It is now at node 2, BEHIND the tortoise (node 3). But since the hare gains 1 position per round, it will catch up.",
        side:"Round 2:\nTortoise: 2 -> 3\nHare: 3 -> 4 -> 2 (looped!)\n\nHare is now BEHIND\ntortoise in the cycle.\n\nGap shrinks by 1\neach round!",
        challenge:{ q:"The hare is in the cycle behind the tortoise. Will they eventually be at the same node?", opts:["No, hare is too fast","Yes! Hare gains 1 position per round, they MUST meet","Only if the cycle length is even"], ans:1 } },
      { hl:[3,4,5,7,8], nodes:["1","2","3","4"], slow:3, fast:3, vars:{slow:"node 4",fast:"node 4"},
        note:"Round 3:\n- Tortoise: node 3 -> node 4\n- Hare: node 2 -> node 3 -> node 4\n\nTHEY ARE BOTH AT NODE 4! The if slow == fast check catches this. return True means: \"yes, there IS a cycle!\"\n\nThe math is beautiful: in a cycle, the hare closes the gap by exactly 1 per round. So no matter the cycle size, they will always meet.",
        side:"Round 3:\nTortoise: 3 -> 4\nHare: 2 -> 3 -> 4\n\nBOTH AT NODE 4!\n\nslow == fast -> True!\nCYCLE DETECTED!" },
      { hl:[], nodes:null, slow:-1, fast:-1, vars:{},
        note:"YOUR CHEAT SHEET:\n\n1. Need to detect a LOOP? Think Tortoise and Hare\n2. Slow pointer: 1 step. Fast pointer: 2 steps\n3. They meet? Loop exists. Fast hits the end? No loop\n4. Zero extra memory! Just two pointers\n\nBonus trick: want to find the MIDDLE of a list? When the hare reaches the end, the tortoise is at the middle (half the speed = half the distance).\n\nReal world: detecting infinite loops in programs, finding the middle of a playlist without knowing its length, checking if a number sequence eventually repeats.",
        side:"SPOT IT IN PROBLEMS:\n\"cycle\" \"linked list\"\n\"middle\" \"circular\"\n\"happy number\"\n\nTRY THESE:\nLeetCode 141: Has Cycle\nLeetCode 142: Cycle Start\nLeetCode 876: Middle of List\nLeetCode 202: Happy Number", sum:true },
    ],
  },
];

/* ═══ LINE-BY-LINE CODE EXPLAINER (per pattern, per line) ═══ */
var LINE_EXPLAINS = {
  "two-pointers": {
    0: "def two_sum_sorted(nums, target): — Creates a function. 'nums' receives a list like '[1,3,5,7,9,11]'. 'target' receives a number like '12'. When this function finishes, it will RETURN a list of two positions — the two numbers that add up to the target.",
    1: "left = 0 — Creates a variable called 'left' and stores the number '0' in it. This '0' represents the POSITION of the first item in our list. We will use 'left' to track which book we are holding on the cheap end.",
    2: "right = len(nums) - 1 — 'len(nums)' counts the items in the list and gives back a number (6 in our case). Then '6 - 1 = 5'. That '5' gets stored in 'right'. Why minus 1? Because positions start at 0, so 6 items live at positions 0,1,2,3,4,5. Position 5 is the LAST book.",
    4: "while left < right: — Python checks: is 'left' smaller than 'right'? If YES, run all the indented code below, then come back and check again. If NO, skip everything and move on. This keeps us looping until the two pointers meet.",
    5: "current = nums[left] + nums[right] — 'nums[left]' goes to the list and grabs the value at position 'left' (gives back 1). 'nums[right]' grabs the value at position 'right' (gives back 11). We add them: '1 + 11 = 12'. That '12' gets stored in 'current'. Now we can compare it to our target.",
    7: "if current == target: — Python compares: does 'current' (which holds 12) equal 'target' (which holds 12)? This gives back 'True' or 'False'. If 'True', the code inside runs. If 'False', Python skips to 'elif'.",
    8: "return [left, right] — 'return' stops the function RIGHT HERE and sends back the value '[left, right]'. If left=0 and right=5, it sends back '[0, 5]'. The caller of our function receives this list as the answer. Nothing after 'return' runs.",
    9: "elif current < target: — Only checked if the 'if' above was False. Compares: is 'current' less than 'target'? If yes, our sum is too small and we need a bigger number.",
    10: "left += 1 — Takes the current value of 'left' (say 0), adds 1, and stores the result (1) back into 'left'. So 'left' now points to position 1 instead of 0. We moved to the next, slightly more expensive book.",
    11: "else: — Runs only if both 'if' and 'elif' were False. Since we checked 'equal' and 'too small', reaching 'else' means the sum must be TOO BIG.",
    12: "right -= 1 — Takes the current value of 'right' (say 5), subtracts 1, stores the result (4) back into 'right'. Now 'right' points to position 4 instead of 5. We picked a cheaper book from the expensive end.",
    14: "return [] — If the while loop finished (left met right) without ever finding a match, we return '[]' — an empty list. The caller receives this and knows: no valid pair exists.",
  },
  "sliding-window": {
    0: "def max_sum_subarray(nums, k): — Creates a function. 'nums' receives a list of numbers. 'k' receives the window size (3). When done, this function will RETURN a single number — the biggest sum of any 'k' consecutive items.",
    1: "window_sum = sum(nums[:k]) — 'nums[:3]' grabs the first 3 items and gives back '[2,1,5]'. 'sum([2,1,5])' adds them up and gives back '8'. That '8' gets stored in 'window_sum'. This is the total cookies for our first window.",
    2: "max_sum = window_sum — Copies the value from 'window_sum' (which is 8) into 'max_sum'. So 'max_sum' now holds '8'. This is our high score. Every new window will be compared against this.",
    4: "for i in range(k, len(nums)): — 'range(3, 6)' produces the numbers '3, 4, 5' one at a time. Each round, the next number gets stored in 'i'. So first round 'i=3', second round 'i=4', third round 'i=5'. Each 'i' is the position of the new house entering our window.",
    5: "window_sum += nums[i] — 'nums[i]' goes to position 'i' in the list and grabs the value there (say position 3 gives back '1'). Then 'window_sum += 1' means: take the old window_sum (8), add 1, store the result (9) back in 'window_sum'. We added the new house that just entered our view.",
    6: "window_sum -= nums[i - k] — 'i - k' calculates which house just LEFT (3 - 3 = 0). 'nums[0]' gives back '2'. Then 'window_sum -= 2' means: take window_sum (9), subtract 2, store the result (7) back. We removed the house that disappeared behind us. The window slid forward!",
    7: "max_sum = max(max_sum, window_sum) — 'max(8, 7)' compares the two numbers and gives back the bigger one: '8'. That '8' gets stored in 'max_sum'. Since 7 did not beat 8, our high score stays the same. If the new sum HAD been bigger, max_sum would update.",
    9: "return max_sum — Sends back whatever is stored in 'max_sum' (which is 9 after all windows are checked). The caller receives this number as the answer: the best window sum.",
  },
  "binary-search": {
    0: "def binary_search(nums, target): — Creates a function. 'nums' is a sorted list like '[2,5,8,12,16,23,38,56,72,91]'. 'target' is the number we want to find (23). The function will RETURN the position where 23 lives, or '-1' if it is not in the list.",
    1: "left = 0 — Stores '0' in 'left'. This marks the leftmost boundary of where we are still guessing. Position 0 is the very first number.",
    2: "right = len(nums) - 1 — 'len(nums)' counts 10 items, gives back '10'. Then '10 - 1 = 9'. Stores '9' in 'right'. This is the rightmost boundary. Together, 'left=0' and 'right=9' mean: our number could be anywhere from position 0 to 9.",
    4: "while left <= right: — Checks: is left less than or equal to right? If YES, there is still at least one position to check. When 'left=5' and 'right=5', there is ONE number left — we still need to check it! That is why we use '<=' not just '<'.",
    5: "mid = (left + right) // 2 — '(0 + 9) = 9'. '9 // 2 = 4' (the '//' divides and drops the decimal, giving a whole number). Stores '4' in 'mid'. This is the middle position of our guessing range. We will look at the number sitting here.",
    7: "if nums[mid] == target: — 'nums[4]' goes to position 4 and grabs '16'. Then checks: does '16' equal '23'? Gives back 'False'. So this block gets skipped.",
    8: "return mid — If the 'if' above was True, this would run. It sends back the value stored in 'mid' (the position where we found the target). The caller receives this position number. The function stops here.",
    9: "elif nums[mid] < target: — Checks: is '16' less than '23'? YES, gives back 'True'. Since 16 is smaller than 23, and the list is sorted, everything to the LEFT of position 4 is even smaller. Our target must be to the RIGHT.",
    10: "left = mid + 1 — '4 + 1 = 5'. Stores '5' in 'left'. This MOVES the left boundary past mid. We just threw away positions 0-4 from our guessing range. Why '+1'? Because we already checked mid and it was wrong — no point checking it twice.",
    11: "else: — Runs when 'nums[mid]' is BIGGER than target. The target must be to the LEFT of mid.",
    12: "right = mid - 1 — Takes 'mid', subtracts 1, stores in 'right'. This moves the right boundary before mid. We threw away everything from mid onward.",
    14: "return -1 — The while loop ended (left passed right, guessing range is empty). We never found the target. Sends back '-1'. The caller receives '-1' and knows the number is not in the list.",
  },
  "hashmap": {
    0: "def two_sum(nums, target): — Creates a function. 'nums' is an UNSORTED list like '[2,7,11,15]'. 'target' is '9'. The function will RETURN a list of two positions whose values add to 9.",
    1: "seen = {} — Creates an empty dictionary and stores it in 'seen'. Think of it as a blank notebook. A dictionary stores pairs: 'key: value'. Ours will store 'number: position' — like writing '2: met at spot 0' in the notebook.",
    3: "for i, num in enumerate(nums): — 'enumerate([2,7,11,15])' produces pairs: '(0,2), (1,7), (2,11), (3,15)'. Each round, the position gets stored in 'i' and the value gets stored in 'num'. First round: 'i=0, num=2'. This gives us BOTH the position and the value.",
    4: "complement = target - num — '9 - 2 = 7'. Stores '7' in 'complement'. This is the number we NEED to find a partner for the current number. If we can find a 7 somewhere, then 2+7=9 and we are done.",
    6: "if complement in seen: — 'in' checks if '7' exists as a KEY in our notebook. Gives back 'True' or 'False'. First round: the notebook is empty, so '7 in {}' gives 'False'. We skip this block.",
    7: "return [seen[complement], i] — If complement WAS found, 'seen[complement]' looks up that key and gives back the position we stored earlier. For example, 'seen[2]' gives back '0'. Then '[0, 1]' gets returned. The caller receives the two positions as the answer.",
    9: "seen[num] = i — Writes in our notebook: the key is 'num' (2), the value is 'i' (0). After this, 'seen' contains '{2: 0}'. Now if any FUTURE number needs a 2 as its complement, it can find it here instantly.",
    11: "return [] — Sends back an empty list. The caller knows: no valid pair was found in the entire list.",
  },
  "stack": {
    0: "def valid_parentheses(s): — Creates a function. 's' receives a string like '\"{[()]}\"'. The function will RETURN either 'True' (brackets are balanced) or 'False' (they are not).",
    1: "stack = [] — Creates an empty list and stores it in 'stack'. We will use this as a pile. When we add items, they go on top. When we remove items, they come off the top. Right now the pile is empty.",
    2: "pairs = {')':'(', '}':'{', ']':'['} — Creates a dictionary with 3 entries. This is a lookup table. If we see ')', we ask the dictionary 'pairs[\")\"]' and it gives back '(' — telling us which opener this closer should match with.",
    4: "for char in s: — Takes the string and walks through it one character at a time. Each round, the next character gets stored in 'char'. Round 1: 'char' holds '{'. Round 2: 'char' holds '['. And so on.",
    5: "if char in '({[': — Checks: is 'char' one of the opening brackets? 'in' looks through the text '({[' for the character. Gives back 'True' or 'False'. If '{' is in '({[', gives 'True'.",
    6: "stack.append(char) — 'append' takes the value in 'char' (say '{') and adds it to the END of our list. After this, 'stack' changes from '[]' to '[\"{\"]'. The '{' is now sitting on top of our pile, waiting for its matching '}'.",
    7: "elif char in ')}]': — Only runs if the 'if' above was False (not an opener). Checks: is it a CLOSER? If 'char' is '}', then '}' in ')}]' gives 'True'.",
    8: "if not stack: — 'not stack' checks if the pile is empty. An empty list '[]' is considered 'False' in Python, so 'not False' gives 'True'. This means: we found a closer but there is NOTHING on the pile to match it with.",
    9: "return False — Sends back 'False' immediately. The function stops. The caller receives 'False' meaning the brackets are broken.",
    10: "if stack[-1] != pairs[char]: — Two lookups happen here. 'stack[-1]' grabs the LAST item from the list (the top of our pile) — say it gives back '('. 'pairs[char]' looks up the closer in our dictionary — 'pairs[\")\"]' gives back '('. Then '!=' checks: are they NOT equal? If '(' != '(' is 'False', so they DO match and this block is skipped. If they did NOT match, this would return False.",
    11: "return False — The top of the pile does not match this closer. Sends back 'False'. The brackets are in the wrong nesting order.",
    12: "stack.pop() — 'pop()' removes the LAST item from the list and gives it back (though we do not store it anywhere — we just throw it away). If stack was '[\"{\", \"[\", \"(\"]', after pop it becomes '[\"{\", \"[\"]' and the value '(' was removed. The opener and closer matched, so we throw away the opener. It is done.",
    14: "return len(stack) == 0 — 'len(stack)' counts items left in the pile, gives back a number (say 0). '0 == 0' gives 'True'. 'True' gets returned. The caller receives 'True' meaning all brackets matched perfectly. If there were leftover items, 'len' would give a number > 0, '>' 0 '== 0' would be 'False', meaning some brackets were never closed.",
  },
  "bfs": {
    0: "from collections import deque — 'import' loads code someone else wrote. 'deque' (say \"deck\") is a special list from Python's built-in library. It is super fast at adding to the back and removing from the front, perfect for our to-visit list of subway stations.",
    2: "def bfs_shortest(graph, start, end): — Creates a function. 'graph' receives the subway map (a dictionary like '{\"A\":[\"B\",\"C\"], ...}'). 'start' receives '\"A\"'. 'end' receives '\"E\"'. The function will RETURN a number — the fewest stops from start to end.",
    3: "queue = deque([(start, 0)]) — Creates a to-visit list with one entry. '(\"A\", 0)' is a tuple: station A paired with 0 stops. 'deque([...])' wraps it in the fast structure. 'queue' now holds: '[( \"A\", 0 )]'. This is our plan: visit A first, it is 0 stops away.",
    4: "visited = {start} — Creates a set containing '\"A\"'. A set is like a checklist — you can instantly check if something is on it. 'visited' now holds '{\"A\"}'. This means: we have already planned to visit A, do not add it again.",
    6: "while queue: — Checks: is the to-visit list non-empty? A non-empty list is 'True' in Python. If 'True', run the code below. When the list eventually empties, this becomes 'False' and we stop.",
    7: "node, dist = queue.popleft() — 'popleft()' removes the FIRST item from the list and gives it back. We get '(\"A\", 0)'. Python unpacks this tuple into two variables: 'node' receives '\"A\"' and 'dist' receives '0'. The to-visit list is now empty (we took A out). We are now \"at\" station A.",
    9: "if node == end: — Checks: does 'node' (\"A\") equal 'end' (\"E\")? Gives 'False'. We are not at our destination yet.",
    10: "return dist — If the check above was 'True', this sends back the number in 'dist'. Because we always visit closer stations first, this number is GUARANTEED to be the shortest route. The caller receives this number.",
    12: "for neighbor in graph[node]: — 'graph[\"A\"]' looks up station A on the subway map and gives back '[ \"B\", \"C\" ]'. The 'for' loop goes through this list: first round 'neighbor' = '\"B\"', second round 'neighbor' = '\"C\"'.",
    13: "if neighbor not in visited: — Checks: is '\"B\"' absent from our visited checklist? 'not in' gives 'True' if B is NOT in the set. Since visited only has '{\"A\"}', B is not there, so 'True'. We should explore B.",
    14: "visited.add(neighbor) — 'add(\"B\")' puts '\"B\"' into the visited set. Now visited is '{\"A\", \"B\"}'. If we encounter B again later, the 'not in' check will give 'False' and we will skip it. No double-visiting!",
    15: "queue.append((neighbor, dist+1)) — Creates a new tuple '(\"B\", 1)' and adds it to the BACK of our to-visit list. '0+1=1' because B is one more stop away than A. The list now has this entry waiting. B will be visited after everything that was already in the list.",
    17: "return -1 — The to-visit list ran out. We visited every reachable station and never found 'end'. Sends back '-1'. The caller receives '-1' and knows: there is no route from start to end.",
  },
  "dfs": {
    0: "def subsets(nums): — Creates a function. 'nums' receives a list like '[1,2,3]'. The function will RETURN a list of ALL possible subsets: '[[], [1], [1,2], [1,2,3], [1,3], [2], [2,3], [3]]'.",
    1: "result = [] — Creates an empty list stored in 'result'. Every time we discover a new subset, we will add it here. At the end, this list will contain all 8 subsets.",
    3: "def backtrack(start, current): — Creates a function INSIDE our function. 'start' will receive a position number (like 0, 1, or 2) telling us where to begin picking. 'current' will receive the subset being built (like '[1,2]').",
    4: "result.append(current[:]) — 'current[:]' makes a COPY of the current list and gives back a new, independent list. If 'current' is '[1,2]', we get a separate '[1,2]'. Then 'append' adds this copy to 'result'. Why copy? Because 'current' will CHANGE later (we will add and remove toppings). Without copying, our saved version would change too — like editing a shared Google Doc instead of saving a PDF snapshot.",
    6: "for i in range(start, len(nums)): — 'range(0, 3)' produces '0, 1, 2'. Each round, the next number goes into 'i'. Starting at 'start' (not always 0) prevents us from going backwards. If start is 1, we only try positions 1 and 2, skipping 0.",
    7: "current.append(nums[i]) — 'nums[0]' grabs '1' (pepperoni). 'append(1)' adds it to the end of 'current'. If current was '[]', it becomes '[1]'. The topping is ON the pizza. We have CHANGED 'current' — that is why we saved a copy earlier, not a reference.",
    8: "backtrack(i + 1, current) — Calls the 'backtrack' function AGAIN with 'start=1' and 'current=[1]'. This goes DEEPER: now we try adding toppings 2 and 3 ON TOP of pepperoni. When this call finishes and returns, we come back here and continue to the next line.",
    9: "current.pop() — 'pop()' removes the LAST item from 'current' and gives it back (we do not save it — it is discarded). If current was '[1,2]', after pop it becomes '[1]' and the removed value was '2'. We TOOK OFF mushroom. Now we are back to just pepperoni, ready to try olive instead. This UNDO step is the entire secret of backtracking.",
    11: "backtrack(0, []) — The first call that kicks everything off. 'start=0' means begin at the first topping. 'current=[]' means start with an empty pizza. This one call triggers the entire tree of exploration.",
    12: "return result — Sends back the 'result' list which now contains all 8 subsets. The caller receives the complete collection.",
  },
  "dp": {
    0: "def climb_stairs(n): — Creates a function. 'n' receives a number like '5' (how many stairs). The function will RETURN a number — how many different ways you can climb those stairs.",
    1: "if n <= 2: return n — '<=' checks: is n less than or equal to 2? If 'n' is 1, '1 <= 2' is 'True', and 'return 1' sends back 1 (1 stair = 1 way). If 'n' is 2, sends back 2 (2 stairs = 2 ways). For 'n=5', '5 <= 2' is 'False', so we skip this and go to the next line.",
    3: "prev2, prev1 = 1, 2 — Creates two variables at once. 'prev2' gets '1' (the answer for stair 1). 'prev1' gets '2' (the answer for stair 2). These are our two sticky notes. We ONLY need the last two answers to compute the next one.",
    5: "for i in range(3, n + 1): — 'range(3, 6)' produces '3, 4, 5'. Each round, 'i' gets the next number. Round 1: 'i=3' (computing stair 3). Round 2: 'i=4'. Round 3: 'i=5'. We need 'n+1' because 'range' stops BEFORE the end number.",
    6: "current = prev1 + prev2 — Takes the values stored in 'prev1' (2) and 'prev2' (1), adds them: '2 + 1 = 3'. Stores '3' in 'current'. This is the answer for stair 3: there are 3 ways to climb 3 stairs. The formula works because you can only reach stair 3 from stair 2 (1 jump) or stair 1 (2 jumps).",
    7: "prev2 = prev1 — Copies the value from 'prev1' (2) into 'prev2'. Now 'prev2' holds '2'. We are sliding our sticky notes forward: what WAS the \"1 stair ago\" answer now becomes the \"2 stairs ago\" answer.",
    8: "prev1 = current — Copies the value from 'current' (3) into 'prev1'. Now 'prev1' holds '3'. The freshly computed answer becomes the new \"1 stair ago\". Next round, we can compute stair 4 using these updated sticky notes.",
    10: "return prev1 — After the loop finishes, 'prev1' holds the answer for stair 'n' (which is 8 for n=5). Sends back '8'. The caller receives this as the final answer.",
  },
  "greedy": {
    0: "def merge_intervals(intervals): — Creates a function. 'intervals' receives a list of time ranges like '[[1,3],[2,6],[8,10],[15,18]]'. The function will RETURN a cleaned-up list where overlapping meetings are merged.",
    1: "intervals.sort(key=lambda x: x[0]) — 'sort()' rearranges the list IN PLACE (it changes the original, does not create a new one). 'key=lambda x: x[0]' tells Python HOW to sort: 'lambda' creates a tiny throwaway function. It receives each meeting as 'x', and 'x[0]' grabs the first number (start time). After sorting, meetings are ordered by start time, earliest first.",
    2: "merged = [intervals[0]] — 'intervals[0]' grabs the first meeting after sorting: '[1,3]'. The square brackets around it create a new list containing just this one meeting: '[[1,3]]'. Stored in 'merged'. This is our result list, starting with one block.",
    4: "for start, end in intervals[1:]: — 'intervals[1:]' gives everything EXCEPT the first item: '[[2,6],[8,10],[15,18]]'. Each round, Python unpacks one meeting into 'start' and 'end'. Round 1: 'start=2, end=6'.",
    5: "if start <= merged[-1][1]: — Two lookups: 'merged[-1]' grabs the LAST item in merged (say '[1,3]'). Then '[1]' grabs its second number (end time): '3'. Then checks: is 'start' (2) less than or equal to 3? '2 <= 3' gives 'True'. This means the new meeting STARTS before the previous one ENDS — they overlap!",
    6: "merged[-1][1] = max(merged[-1][1], end) — 'max(3, 6)' compares and gives back '6'. Then 'merged[-1][1] = 6' CHANGES the end time of the last merged block from 3 to 6. So '[1,3]' becomes '[1,6]'. We EXTENDED the block to cover both meetings.",
    7: "else: — Runs when the meetings do NOT overlap (start is after the previous end). There is a gap between them.",
    8: "merged.append([start, end]) — Creates a new list '[8,10]' and adds it to the end of 'merged'. After this, merged is '[[1,6],[8,10]]'. This meeting stands alone as a separate block because it does not touch the previous one.",
    10: "return merged — Sends back the 'merged' list: '[[1,6],[8,10],[15,18]]'. The caller receives this cleaned-up schedule where no meetings overlap.",
  },
  "fast-slow": {
    0: "def has_cycle(head): — Creates a function. 'head' receives the first node of a linked list (a chain of boxes connected by arrows). The function will RETURN either 'True' (there is a loop) or 'False' (no loop).",
    1: "slow = fast = head — Creates two variables and BOTH get the same starting node. 'slow' points to the first box. 'fast' also points to the first box. They will move at different speeds to detect if the chain loops back on itself.",
    3: "while fast and fast.next: — Two checks. 'fast' checks: does the hare still exist (not None)? 'fast.next' checks: is there a next box after the hare? If EITHER is None/missing, the chain ended, meaning NO loop. Both must be True to continue. The 'and' means both conditions must pass.",
    4: "slow = slow.next — '.next' follows the arrow from the current box to the next one and gives back that next box. 'slow' now points to whatever box comes after it. ONE step forward. If slow was at box 1, it is now at box 2.",
    5: "fast = fast.next.next — '.next' gives the next box. '.next' again gives the box AFTER that. Two hops! If fast was at box 1, '.next' goes to box 2, '.next' again goes to box 3. 'fast' now points to box 3. This is why we checked 'fast.next' in the while — without it, the second '.next' would crash if there is nothing there.",
    7: "if slow == fast: — Checks: are 'slow' and 'fast' pointing to the SAME box? '==' compares the two. If 'True', both runners are at the same spot. On a straight chain, this can never happen (the hare is always ahead). The only way they meet is if the chain LOOPS and the hare lapped the tortoise.",
    8: "return True — Sends back 'True'. The caller receives 'True' and knows: yes, there IS a cycle in this linked list.",
    10: "return False — The while loop ended because 'fast' or 'fast.next' was None — the hare ran off the end of the chain. Sends back 'False'. No loop exists.",
  },
};

/* ============= VISUALIZATION ============= */
function Viz({ step, pattern }) {
  const vt = pattern.vizType;
  const c = pattern.color;
  // Use CSS var(--cell) for sizing; JS fallback only for inline calcs
  const cssDim = "var(--cell)";

  if (vt === "array-ptrs") {
    const p = step.ptrs || {};
    return (
      <div className="viz-wrap">
        {step.arr.map((v, i) => {
          const isL = p.L === i;
          const isR = p.R === i;
          const act = isL || isR;
          return (
            <div key={i} className="viz-cell">
              <div className={act ? "cell-active-glow" : ""} style={{
                "--cell-glow": isL ? "rgba(255,107,107,0.35)" : "rgba(78,205,196,0.35)",
                width: cssDim, height: cssDim, borderRadius: "var(--cell-r)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontFamily: "'DM Mono',monospace", fontWeight: 700, fontSize: "var(--cell-font)",
                transition: "all 0.4s cubic-bezier(0.34,1.56,0.64,1)",
                transform: act ? "scale(1.12)" : "scale(1)",
                background: act ? (isL ? "linear-gradient(135deg,#FF6B6B,#FF6B6B88)" : "linear-gradient(135deg,#4ECDC4,#4ECDC488)") : "rgba(255,255,255,0.03)",
                border: act ? ("2px solid " + (isL ? "#FF6B6B" : "#4ECDC4")) : "1px solid rgba(255,255,255,0.08)",
                color: act ? "#fff" : "#888",
              }}>{v}</div>
              <div className="idx-label">[{i}]</div>
              <div className={"cell-tag" + ((isL || isR) ? " cell-tag-bounce" : "")} style={{ color: isL ? "#FF6B6B" : isR ? "#4ECDC4" : "transparent" }}>
                {isL ? "LEFT" : isR ? "RIGHT" : "-"}
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  if (vt === "array-window") {
    const w = step.win;
    return (
      <div className="viz-wrap">
        {step.arr.map((v, i) => {
          const inW = w && i >= w[0] && i <= w[1];
          const out = step.sOut === i;
          const inn = step.sIn === i;
          return (
            <div key={i} className="viz-cell">
              <div className={inn ? "cell-active-glow" : ""} style={{
                "--cell-glow": inn ? "rgba(78,205,196,0.45)" : undefined,
                width: cssDim, height: cssDim, borderRadius: "var(--cell-r)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontFamily: "'DM Mono'", fontWeight: 700, fontSize: "var(--cell-font)",
                background: inW ? "linear-gradient(135deg,#4ECDC433,#4ECDC411)" : out ? "rgba(239,68,68,0.12)" : "rgba(255,255,255,0.03)",
                border: inW ? "2px solid #4ECDC4" : out ? "2px dashed #EF444466" : "1px solid rgba(255,255,255,0.08)",
                color: inW ? "#4ECDC4" : out ? "#EF444488" : "#666",
                transition: "all 0.4s ease",
                transform: inW ? "scale(1.08)" : "scale(1)",
              }}>{v}</div>
              <div className="idx-label">[{i}]</div>
              <div className="cell-tag" style={{ color: out ? "#EF4444" : inn ? "#4ECDC4" : "transparent" }}>
                {out ? "-OUT" : inn ? "+IN" : "-"}
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  if (vt === "array-bsearch") {
    const z = step.z;
    return (
      <div className="viz-wrap">
        {step.arr.map((v, i) => {
          const isElim = z && z.elim && (z.elim.length === 2 ? (i >= z.elim[0] && i <= z.elim[1]) : z.elim.length === 4 ? ((i >= z.elim[0] && i <= z.elim[1]) || (i >= z.elim[2] && i <= z.elim[3])) : false);
          const isMid = z && z.m === i;
          const isL = z && z.l === i && !isMid;
          const isR = z && z.r === i && !isMid;
          const inR = z && !isElim && i >= z.l && i <= z.r;
          return (
            <div key={i} className="viz-cell">
              <div className={isMid ? "cell-active-glow" : ""} style={{
                "--cell-glow": "rgba(167,139,250,0.4)",
                width: cssDim, height: cssDim, borderRadius: "var(--cell-r)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontFamily: "'DM Mono'", fontWeight: isMid ? 800 : 600, fontSize: "var(--cell-font)",
                background: isMid ? "linear-gradient(135deg,#A78BFA,#8B5CF6)" : isElim ? "rgba(255,255,255,0.01)" : inR ? "rgba(167,139,250,0.1)" : "rgba(255,255,255,0.03)",
                border: isMid ? "2px solid #A78BFA" : "1px solid rgba(255,255,255,0.06)",
                color: isMid ? "#fff" : isElim ? "#333" : inR ? "#C4B5FD" : "#555",
                transition: "all 0.5s ease",
                transform: isMid ? "scale(1.15)" : "scale(1)",
                opacity: isElim ? 0.35 : 1,
                textDecoration: isElim ? "line-through" : "none",
              }}>{v}</div>
              <div className="idx-label">[{i}]</div>
              <div className={"cell-tag" + (isMid ? " cell-tag-bounce" : "")} style={{ color: isMid ? "#A78BFA" : isL ? "#10B981" : isR ? "#F59E0B" : "transparent" }}>
                {isMid ? "MID" : isL ? "L" : isR ? "R" : "-"}
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  if (vt === "hashmap") {
    const hm = step.hmap || {};
    const entries = Object.entries(hm);
    return (
      <div className="dual-viz">
        <div className="viz-cell-col">
          <div className="viz-label">ARRAY</div>
          <div style={{ display: "flex", gap: "var(--cell-gap)" }}>
            {step.arr.map((v, i) => {
              var isActive = step.idx === i;
              return (
              <div key={i} className={isActive ? "cell-active-glow" : ""} style={{
                "--cell-glow": "rgba(245,158,11,0.4)",
                width: cssDim, height: cssDim, borderRadius: "var(--cell-r)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontFamily: "'DM Mono'", fontWeight: 700, fontSize: "var(--cell-font)",
                background: isActive ? "linear-gradient(135deg,#F59E0B,#F59E0B88)" : "rgba(255,255,255,0.03)",
                border: isActive ? "2px solid #F59E0B" : "1px solid rgba(255,255,255,0.08)",
                color: isActive ? "#fff" : "#888",
                transition: "all 0.4s ease",
                transform: isActive ? "scale(1.12)" : "scale(1)",
              }}>{v}</div>
              );
            })}
          </div>
        </div>
        <div className="viz-cell-col">
          <div className="viz-label">HASHMAP</div>
          <div style={{ minWidth: 80, minHeight: 40, borderRadius: 10, border: "1px solid rgba(245,158,11,0.2)", background: "rgba(245,158,11,0.03)", padding: "8px 12px", display: "flex", flexDirection: "column", gap: 3 }}>
            {entries.length === 0 && <div style={{ fontSize: 11, color: "#555", fontFamily: "'DM Mono'" }}>empty</div>}
            {entries.map(([k, v]) => (
              <div key={k} style={{ fontSize: 12, fontFamily: "'DM Mono'", color: "#F59E0B", animation: "popIn 0.3s ease" }}>{k} : idx {v}</div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (vt === "stack") {
    return (
      <div className="dual-viz">
        <div className="viz-cell-col">
          <div className="viz-label">INPUT</div>
          <div style={{ display: "flex", gap: "var(--cell-gap)" }}>
            {(step.input || []).map((ch, i) => {
              const cur = i === step.inIdx;
              const dn = i < step.inIdx;
              return (
                <div key={i} className={cur ? "cell-active-glow" : ""} style={{
                  "--cell-glow": "rgba(236,72,153,0.4)",
                  width: 36, height: 36, borderRadius: 8,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 16, fontWeight: 700, fontFamily: "'DM Mono'",
                  background: cur ? "linear-gradient(135deg,#EC4899,#F472B6)" : dn ? "rgba(255,255,255,0.02)" : "rgba(255,255,255,0.05)",
                  border: cur ? "2px solid #EC4899" : "1px solid rgba(255,255,255,0.08)",
                  color: cur ? "#fff" : dn ? "#444" : "#AAA",
                  transition: "all 0.4s ease",
                  transform: cur ? "scale(1.15)" : "scale(1)",
                  flexShrink: 0,
                }}>{ch}</div>
              );
            })}
          </div>
        </div>
        <div className="viz-cell-col">
          <div className="viz-label">STACK</div>
          <div style={{ minWidth: 50, minHeight: 44, borderRadius: 10, border: "2px solid rgba(236,72,153,0.2)", borderTop: "2px dashed rgba(236,72,153,0.15)", background: "rgba(236,72,153,0.03)", display: "flex", flexDirection: "column-reverse", alignItems: "center", padding: "6px 10px", gap: 3 }}>
            {(step.stk || []).length === 0 && <div style={{ fontSize: 10, color: "#555", padding: 6 }}>empty</div>}
            {(step.stk || []).map((it, i) => (
              <div key={i} style={{
                width: 38, height: 32, borderRadius: 6,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 16, fontWeight: 700, color: "#fff", fontFamily: "'DM Mono'",
                background: i === (step.stk || []).length - 1 ? "linear-gradient(135deg,#EC4899,#D946EF)" : "rgba(236,72,153,0.15)",
                animation: i === (step.stk || []).length - 1 ? "popIn 0.3s ease" : "none",
              }}>{it}</div>
            ))}
          </div>
          {(step.stk || []).length > 0 && <div style={{ fontSize: 8, color: "#EC4899", fontWeight: 700 }}>TOP</div>}
        </div>
      </div>
    );
  }

  if (vt === "grid") {
    const g = step.grid;
    if (!g) return <div style={{ textAlign: "center", padding: 16, color: "#555", fontSize: 13 }}>Graph: A-B-D-E with A-C-D shortcut</div>;
    const pos = { A: [50, 50], B: [150, 20], C: [150, 80], D: [250, 50], E: [350, 50] };
    return (
      <div style={{ display: "flex", justifyContent: "center", padding: "8px 0" }}>
        <svg viewBox="0 0 400 110" className="graph-svg">
          <defs>
            <filter id="nodeGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>
          {g.edges.map(([a, b], i) => (
            <line key={i} x1={pos[a][0]} y1={pos[a][1]} x2={pos[b][0]} y2={pos[b][1]} stroke="rgba(255,255,255,0.12)" strokeWidth="2" />
          ))}
          {g.nodes.map(n => {
            const [x, y] = pos[n];
            const vis = g.visited && g.visited.includes(n);
            const cur = g.current === n;
            return (
              <g key={n}>
                {cur && <circle cx={x} cy={y} r={24} fill="none" stroke="#06B6D466" strokeWidth="2">
                  <animate attributeName="r" values="22;26;22" dur="1.5s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.6;0.2;0.6" dur="1.5s" repeatCount="indefinite" />
                </circle>}
                <circle cx={x} cy={y} r={20} fill={cur ? "#06B6D4" : vis ? "rgba(6,182,212,0.2)" : "rgba(255,255,255,0.04)"} stroke={cur ? "#06B6D4" : vis ? "#06B6D466" : "rgba(255,255,255,0.1)"} strokeWidth={cur ? 2.5 : 1.5} filter={cur ? "url(#nodeGlow)" : undefined} />
                <text x={x} y={y + 5} textAnchor="middle" fill={cur ? "#fff" : vis ? "#67E8F9" : "#888"} fontSize="14" fontWeight="700" fontFamily="monospace">{n}</text>
              </g>
            );
          })}
        </svg>
      </div>
    );
  }

  if (vt === "tree") {
    const t = step.tree;
    if (!t) return <div style={{ textAlign: "center", padding: 16, color: "#555", fontSize: 13 }}>Decision tree for subsets of [1,2,3]</div>;
    return (
      <div style={{ display: "flex", gap: 4, flexWrap: "wrap", justifyContent: "center", padding: "8px 0" }}>
        {t.path.map((p, i) => {
          const act = t.active === p;
          const isBack = p === "back";
          return (
            <div key={i} style={{
              padding: "6px 12px", borderRadius: 8, fontSize: 12, fontFamily: "'DM Mono'", fontWeight: act ? 700 : 400,
              background: isBack ? "rgba(139,92,246,0.08)" : act ? "rgba(139,92,246,0.2)" : "rgba(255,255,255,0.04)",
              color: isBack ? "#A78BFA" : act ? "#C4B5FD" : "#888",
              border: act ? "1px solid #8B5CF6" : "1px solid rgba(255,255,255,0.06)",
              animation: i === t.path.length - 1 ? "popIn 0.3s ease" : "none",
            }}>{isBack ? "backtrack" : p}</div>
          );
        })}
      </div>
    );
  }

  if (vt === "dp-table") {
    const dp = step.dpArr;
    if (!dp) return <div style={{ textAlign: "center", padding: 16, color: "#555", fontSize: 13 }}>Building answers bottom-up for n=5</div>;
    return (
      <div style={{ display: "flex", gap: 6, justifyContent: "center", flexWrap: "wrap", padding: "10px 0", alignItems: "flex-start" }}>
        {dp.map((d, i) => (
          <div key={i} className="viz-cell">
            <div style={{ fontSize: 9, color: "#888", fontFamily: "'DM Mono'" }}>n={d.n}</div>
            <div className={d.active ? "cell-active-glow" : ""} style={{
              "--cell-glow": "rgba(16,185,129,0.4)",
              width: cssDim, height: cssDim, borderRadius: "var(--cell-r)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontFamily: "'DM Mono'", fontWeight: 700, fontSize: 18,
              background: d.active ? "linear-gradient(135deg,#10B981,#059669)" : "rgba(16,185,129,0.08)",
              border: d.active ? "2px solid #10B981" : "1px solid rgba(16,185,129,0.15)",
              color: d.active ? "#fff" : "#6EE7B7",
              transition: "all 0.4s ease",
              transform: d.active ? "scale(1.12)" : "scale(1)",
            }}>{d.val}</div>
            <div className="cell-tag" style={{ color: "#555" }}>{d.val} way{d.val > 1 ? "s" : ""}</div>
          </div>
        ))}
      </div>
    );
  }

  if (vt === "intervals") {
    const ivs = step.ivals;
    const mg = step.merged || [];
    if (!ivs && mg.length > 0) {
      return (
        <div style={{ display: "flex", gap: 6, justifyContent: "center", flexWrap: "wrap", padding: "10px 0" }}>
          {mg.map((m, i) => (
            <div key={i} style={{ padding: "8px 16px", borderRadius: 10, background: "rgba(249,115,22,0.12)", border: "1px solid rgba(249,115,22,0.3)", fontFamily: "'DM Mono'", fontSize: 13, color: "#FB923C", fontWeight: 600 }}>
              [{m[0]}, {m[1]}]
            </div>
          ))}
        </div>
      );
    }
    if (!ivs) return null;
    return (
      <div style={{ padding: "10px 0" }}>
        {ivs.map((iv, i) => {
          const act = step.activeI === i;
          return (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
              <div style={{ fontSize: 10, color: "#888", fontFamily: "'DM Mono'", width: 55, textAlign: "right", flexShrink: 0 }}>[{iv[0]},{iv[1]}]</div>
              <div style={{ flex: 1, height: 24, position: "relative", borderRadius: 6, background: "rgba(255,255,255,0.03)", minWidth: 60 }}>
                <div style={{ position: "absolute", left: (iv[0] / 20 * 100) + "%", right: (100 - iv[1] / 20 * 100) + "%", top: 0, bottom: 0, borderRadius: 6, background: act ? c + "66" : c + "22", border: act ? "1.5px solid " + c : "1px solid " + c + "33", transition: "all 0.4s ease" }} />
              </div>
            </div>
          );
        })}
        {mg.length > 0 && <div style={{ marginTop: 6, fontSize: 10, color: "#888", textAlign: "center" }}>Merged: {mg.map(m => "[" + m[0] + "," + m[1] + "]").join(" ")}</div>}
      </div>
    );
  }

  if (vt === "linkedlist") {
    const nodes = step.nodes;
    if (!nodes) return <div style={{ textAlign: "center", padding: 16, color: "#555", fontSize: 13 }}>Two runners on a linked list</div>;
    return (
      <div className="ll-wrap">
        {nodes.map((n, i) => {
          const isS = step.slow === i;
          const isF = step.fast === i;
          const both = isS && isF;
          const hasLabel = isS || isF;
          return (
            <div key={i} className="ll-node-group">
              <div className="ll-node">
                <div className={(isS || isF) ? "cell-active-glow" : ""} style={{
                  "--cell-glow": both ? "rgba(139,92,246,0.4)" : isS ? "rgba(59,130,246,0.4)" : "rgba(239,68,68,0.4)",
                  width: cssDim, height: cssDim, borderRadius: "50%",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontFamily: "'DM Mono'", fontWeight: 700, fontSize: "var(--cell-font)",
                  background: both ? "linear-gradient(135deg,#3B82F6,#8B5CF6)" : isS ? "rgba(59,130,246,0.2)" : isF ? "rgba(239,68,68,0.2)" : "rgba(255,255,255,0.04)",
                  border: both ? "2px solid #8B5CF6" : isS ? "2px solid #3B82F6" : isF ? "2px solid #EF4444" : "1px solid rgba(255,255,255,0.1)",
                  color: (both || isS || isF) ? "#fff" : "#888",
                  transition: "all 0.4s ease",
                  transform: (isS || isF) ? "scale(1.1)" : "scale(1)",
                  flexShrink: 0,
                }}>{n}</div>
                <div className="cell-tag" style={{ color: both ? "#A78BFA" : isS ? "#3B82F6" : isF ? "#EF4444" : "transparent" }}>
                  {both ? "MEET" : isS ? "slow" : isF ? "fast" : "-"}
                </div>
              </div>
              {i < nodes.length - 1 && <div className="ll-arrow">{">"}</div>}
            </div>
          );
        })}
        <div className="ll-cycle">cycle</div>
      </div>
    );
  }

  return null;
}

function CodeBlock({ code, hl, color }) {
  return (
    <div className="code-wrap">
      {code.map((line, i) => {
        const h = hl.includes(i);
        return (
          <div key={i} style={{ padding: "1.5px 10px 1.5px 0", background: h ? (color + "12") : "transparent", borderLeft: h ? ("3px solid " + color) : "3px solid transparent", display: "flex", gap: 6, transition: "all 0.3s ease" }}>
            <span className="line-num" style={{ color: h ? color : "#2A2A2A", fontWeight: h ? 700 : 400 }}>{i + 1}</span>
            <code style={{ color: h ? "#E2E2E8" : "#555", fontWeight: h ? 500 : 400, whiteSpace: "pre", fontFamily: "'DM Mono',monospace", fontSize: "clamp(10.5px,2.5vw,12.5px)" }}>{line || " "}</code>
          </div>
        );
      })}
    </div>
  );
}

function CodeExplainer({ patternId, hl, color }) {
  var explains = LINE_EXPLAINS[patternId];
  if (!explains) return null;
  var activeLines = (hl || []).filter(function (l) { return explains[l]; });
  if (activeLines.length === 0) return null;
  return (
    <div style={{ marginTop: 10, animation: "slideR 0.3s ease" }}>
      <div style={{ fontSize: 9, color: "#555", fontWeight: 600, letterSpacing: 1, marginBottom: 8, display: "flex", alignItems: "center", gap: 5 }}>
        <Lightbulb size={11} color="#F59E0B" />
        LINE BY LINE
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {activeLines.map(function (lineIdx) {
          var raw = explains[lineIdx];
          var dashIdx = raw.indexOf(" — ");
          var codePart = dashIdx > -1 ? raw.substring(0, dashIdx) : "";
          var explainPart = dashIdx > -1 ? raw.substring(dashIdx + 3) : raw;
          var sentences = explainPart.split(". ").filter(function (s) { return s.trim().length > 0; });
          return (
            <div key={lineIdx} style={{
              background: "rgba(255,255,255,0.015)",
              border: "1px solid rgba(255,255,255,0.06)",
              borderRadius: 12, padding: "12px 14px",
              animation: "popIn 0.3s ease",
            }}>
              {/* Line number + code snippet */}
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                <span style={{ fontSize: 9, fontWeight: 700, color: color, background: color + "18", padding: "2px 7px", borderRadius: 4, fontFamily: "'DM Mono'", flexShrink: 0 }}>L{lineIdx + 1}</span>
                {codePart && <code style={{ fontSize: 11, color: "#E2E2E8", fontFamily: "'DM Mono',monospace", background: "rgba(255,255,255,0.06)", padding: "3px 8px", borderRadius: 6, whiteSpace: "nowrap", overflow: "auto", maxWidth: "100%" }}>{codePart}</code>}
              </div>
              {/* Explanation sentences - each on its own line */}
              <div style={{ display: "flex", flexDirection: "column", gap: 5, paddingLeft: 2 }}>
                {sentences.map(function (sentence, si) {
                  var cleaned = sentence.trim();
                  if (!cleaned) return null;
                  if (cleaned.charAt(cleaned.length - 1) !== "." && cleaned.charAt(cleaned.length - 1) !== "!" && cleaned.charAt(cleaned.length - 1) !== "?") {
                    cleaned = cleaned + ".";
                  }
                  var hasInlineCode = cleaned.indexOf("'") > -1;
                  if (!hasInlineCode) {
                    return (
                      <div key={si} style={{ fontSize: 12, color: "#AAA", lineHeight: 1.6 }}>
                        {cleaned}
                      </div>
                    );
                  }
                  var parts = cleaned.split("'");
                  return (
                    <div key={si} style={{ fontSize: 12, color: "#AAA", lineHeight: 1.6 }}>
                      {parts.map(function (part, pi) {
                        if (pi % 2 === 1) {
                          return <code key={pi} style={{ color: "#F59E0B", fontFamily: "'DM Mono'", fontSize: 11, background: "rgba(245,158,11,0.08)", padding: "1px 5px", borderRadius: 3 }}>{part}</code>;
                        }
                        return <span key={pi}>{part}</span>;
                      })}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function MemoryView({ vars, color, stepIndex }) {
  var e = Object.entries(vars || {});
  var prevRef = useRef({});
  var prev = prevRef.current;

  // Compute change status for each variable
  var changes = {};
  e.forEach(function (pair) {
    var k = pair[0], v = pair[1];
    if (!(k in prev)) {
      changes[k] = "new";
    } else if (String(prev[k]) !== String(v)) {
      changes[k] = "changed";
    } else {
      changes[k] = "same";
    }
  });

  // Update ref for next render
  useEffect(function () {
    prevRef.current = Object.assign({}, vars || {});
  }, [stepIndex]);

  if (!e.length) return null;

  function renderValue(sv, status, vColor) {
    var isList = sv.length > 1 && sv.charAt(0) === "[" && sv.charAt(sv.length - 1) === "]";
    var isSet = sv.length > 1 && sv.charAt(0) === "{" && sv.charAt(sv.length - 1) === "}";
    var isNum = !isNaN(sv) && sv.trim() !== "";
    var glowBorder = status === "new" ? "rgba(16,185,129,0.5)" : status === "changed" ? "rgba(245,158,11,0.5)" : "transparent";
    var glowShadow = status === "new" ? "0 0 8px rgba(16,185,129,0.2)" : status === "changed" ? "0 0 8px rgba(245,158,11,0.15)" : "none";

    if (isList) {
      var items = sv.slice(1, -1).split(",");
      return (
        <div style={{ display: "flex", alignItems: "center", gap: 3, flexWrap: "wrap", boxShadow: glowShadow, borderRadius: 6, padding: "1px 2px" }}>
          <span style={{ color: "#555", fontSize: 10, fontFamily: "'DM Mono'" }}>{"["}</span>
          {items.map(function (item, idx) {
            var trimmed = item.trim();
            if (!trimmed) return null;
            return (
              <div key={idx} style={{ display: "flex", alignItems: "center", gap: 2 }}>
                <div style={{
                  padding: "3px 8px", borderRadius: 6, fontSize: 11, fontFamily: "'DM Mono'", fontWeight: 600,
                  background: vColor ? vColor + "12" : "rgba(245,158,11,0.08)",
                  border: "1px solid " + (vColor ? vColor + "30" : "rgba(245,158,11,0.2)"),
                  color: vColor || "#F59E0B",
                }}>{trimmed}</div>
                {idx < items.length - 1 && <span style={{ color: "#444", fontSize: 10 }}>,</span>}
              </div>
            );
          })}
          <span style={{ color: "#555", fontSize: 10, fontFamily: "'DM Mono'" }}>{"]"}</span>
        </div>
      );
    }
    if (isSet) {
      var sitems = sv.slice(1, -1).split(",");
      return (
        <div style={{ display: "flex", alignItems: "center", gap: 3, flexWrap: "wrap", boxShadow: glowShadow, borderRadius: 6, padding: "1px 2px" }}>
          <span style={{ color: "#555", fontSize: 10, fontFamily: "'DM Mono'" }}>{"{"}</span>
          {sitems.map(function (item, idx) {
            var trimmed = item.trim();
            if (!trimmed) return null;
            return (
              <div key={idx} style={{ display: "flex", alignItems: "center", gap: 2 }}>
                <div style={{
                  padding: "2px 7px", borderRadius: 10, fontSize: 10, fontFamily: "'DM Mono'", fontWeight: 600,
                  background: "rgba(6,182,212,0.1)", border: "1px solid rgba(6,182,212,0.25)", color: "#67E8F9",
                }}>{trimmed}</div>
                {idx < sitems.length - 1 && <span style={{ color: "#444", fontSize: 10 }}>,</span>}
              </div>
            );
          })}
          <span style={{ color: "#555", fontSize: 10, fontFamily: "'DM Mono'" }}>{"}"}</span>
        </div>
      );
    }
    return (
      <div style={{
        padding: "3px 10px", borderRadius: 6, fontSize: 11, fontFamily: "'DM Mono'", fontWeight: 600,
        background: isNum ? "rgba(16,185,129,0.1)" : "rgba(245,158,11,0.08)",
        border: "1px solid " + (isNum ? "rgba(16,185,129,0.25)" : "rgba(245,158,11,0.15)"),
        color: isNum ? "#6EE7B7" : "#FCD34D",
        boxShadow: glowShadow,
        transition: "all 0.3s ease",
      }}>{sv}</div>
    );
  }

  return (
    <div style={{ animation: "fadeUp 0.25s ease" }}>
      <div style={{ fontSize: 9, color: "#555", fontWeight: 600, letterSpacing: 1, marginBottom: 8, display: "flex", alignItems: "center", gap: 5 }}>
        <Database size={10} color="#F59E0B" />
        MEMORY
      </div>
      <div style={{ background: "rgba(255,255,255,0.015)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 12, padding: "10px 12px", display: "flex", flexDirection: "column", gap: 0 }}>
        {e.map(function (pair, idx) {
          var k = pair[0], v = pair[1];
          var sv = String(v);
          var status = changes[k] || "same";
          var prevVal = prev[k] !== undefined ? String(prev[k]) : null;
          var statusColor = status === "new" ? "#10B981" : status === "changed" ? "#F59E0B" : "transparent";
          var statusLabel = status === "new" ? "NEW" : status === "changed" ? "UPDATED" : null;

          return (
            <div key={k} style={{
              display: "flex", alignItems: "center", gap: 10, padding: "8px 6px",
              borderBottom: idx < e.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none",
              animation: status === "new" ? "popIn 0.4s ease" : status === "changed" ? "popIn 0.3s ease" : "none",
            }}>
              {/* Variable name */}
              <div style={{ fontSize: 11, color: "#999", fontFamily: "'DM Mono'", minWidth: 70, flexShrink: 0, display: "flex", alignItems: "center", gap: 6 }}>
                {k}
                {statusLabel && (
                  <span style={{ fontSize: 7, fontWeight: 700, color: statusColor, background: statusColor + "18", padding: "1px 5px", borderRadius: 3, letterSpacing: 0.5 }}>{statusLabel}</span>
                )}
              </div>

              {/* Arrow */}
              <div style={{ color: "#333", fontSize: 10, flexShrink: 0 }}>{status === "changed" ? ":" : "="}</div>

              {/* Value */}
              <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap", flex: 1, minWidth: 0 }}>
                {status === "changed" && prevVal && (
                  <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                    <span style={{ fontSize: 10, fontFamily: "'DM Mono'", color: "#555", textDecoration: "line-through", opacity: 0.6 }}>{prevVal}</span>
                    <span style={{ fontSize: 10, color: "#F59E0B" }}>{">"}</span>
                  </div>
                )}
                {renderValue(sv, status, color)}
              </div>
            </div>
          );
        })}

      </div>
    </div>
  );
}

/* ════════ PROBLEM LAB: Real problems, full guided solve ════════ */
const PROBLEMS = [
  {
    id: "p1",
    title: "Container With Most Water",
    difficulty: "Medium",
    diffColor: "#F59E0B",
    source: "LeetCode 11",
    desc: "You are given an array of heights. Each element represents a vertical line on a graph. Find two lines that together with the x-axis form a container that holds the most water. Return the maximum amount of water.",
    example: "Input: [1,8,6,2,5,4,8,3,7]\nOutput: 49\nExplanation: Lines at index 1 (height 8) and index 8 (height 7) form the container. Width = 8-1 = 7, height = min(8,7) = 7, area = 49.",
    signalWords: ["two", "maximum", "array", "pair of elements"],
    correctPattern: "Two Pointers",
    patternIcon: "arrow-lr",
    patternColor: "#FF6B6B",
    whyThisPattern: "We need to find the best PAIR of lines. The array is not sorted, but we can still use two pointers because moving the shorter line inward is always the smart choice - keeping the taller line gives us the best chance of finding more water.",
    approach: [
      "Start with the widest container: left=0, right=end",
      "Calculate area = min(height[left], height[right]) * (right - left)",
      "Move the SHORTER side inward (it limits our water)",
      "Track the maximum area seen so far",
      "Stop when pointers meet",
    ],
    code: [
      "def max_area(height):",
      "    left, right = 0, len(height) - 1",
      "    max_water = 0",
      "",
      "    while left < right:",
      "        width = right - left",
      "        h = min(height[left], height[right])",
      "        max_water = max(max_water, width * h)",
      "",
      "        if height[left] < height[right]:",
      "            left += 1",
      "        else:",
      "            right -= 1",
      "",
      "    return max_water",
    ],
    walkthrough: [
      { hl: [0, 1, 2], note: "Start with the widest container. left=0, right=8. This gives us the maximum width to start." },
      { hl: [4, 5, 6, 7], note: "Width = 8, h = min(1, 7) = 1, area = 8. Not great because left side (height 1) is tiny!" },
      { hl: [9, 10], note: "height[left]=1 < height[right]=7, so move LEFT inward. The short side limits us, always move it!" },
      { hl: [4, 5, 6, 7], note: "Now left=1, right=8. Width=7, h=min(8,7)=7, area=49. MUCH better! That is our answer." },
      { hl: [14], note: "We continue until pointers meet, but 49 stays the max. The key insight: moving the shorter side is GREEDY — keeping the tall side gives the best chance for improvement." },
    ],
    complexity: "O(n) time, O(1) space - single pass with two pointers!",
    bruteForce: "O(n squared) - checking every pair of lines",
  },
  {
    id: "p2",
    title: "Longest Substring Without Repeating",
    difficulty: "Medium",
    diffColor: "#F59E0B",
    source: "LeetCode 3",
    desc: "Given a string, find the length of the longest substring without repeating characters.",
    example: "Input: 'abcabcbb'\nOutput: 3\nExplanation: 'abc' is the longest substring without repeats.",
    signalWords: ["longest", "substring", "without repeating", "contiguous"],
    correctPattern: "Sliding Window",
    patternIcon: "sliders",
    patternColor: "#4ECDC4",
    whyThisPattern: "We need a CONTIGUOUS substring (not subsequence). 'Longest' + 'substring' + a constraint (no repeats) = classic sliding window. We expand the window right, and shrink from the left when we see a duplicate.",
    approach: [
      "Use a set to track characters in current window",
      "Expand window by moving right pointer",
      "If we see a duplicate, shrink from left until no duplicate",
      "Track the maximum window size",
    ],
    code: [
      "def length_of_longest(s):",
      "    char_set = set()",
      "    left = 0",
      "    max_len = 0",
      "",
      "    for right in range(len(s)):",
      "        while s[right] in char_set:",
      "            char_set.remove(s[left])",
      "            left += 1",
      "        char_set.add(s[right])",
      "        max_len = max(max_len, right - left + 1)",
      "",
      "    return max_len",
    ],
    walkthrough: [
      { hl: [0, 1, 2, 3], note: "Set up: a set to track window contents, left pointer at 0, max length tracker." },
      { hl: [5, 9, 10], note: "right=0: 'a' not in set. Add it. Window='a', length=1. right=1: 'b' not in set. Window='ab', length=2. right=2: 'c' added. Window='abc', length=3." },
      { hl: [6, 7, 8], note: "right=3: 'a' IS in set! Shrink from left: remove 'a', left moves to 1. Now window='bca', still length 3." },
      { hl: [5, 9, 10], note: "Continue expanding. The window slides forward, always maintaining no duplicates. Max stays 3." },
      { hl: [12], note: "Return 3. The window dynamically expanded and contracted, always keeping the longest valid substring." },
    ],
    complexity: "O(n) time, O(min(n, alphabet)) space",
    bruteForce: "O(n cubed) - check every substring for uniqueness",
  },
  {
    id: "p3",
    title: "Search in Rotated Sorted Array",
    difficulty: "Medium",
    diffColor: "#F59E0B",
    source: "LeetCode 33",
    desc: "An originally sorted array was rotated at some pivot. Given the rotated array and a target, return its index or -1 if not found. You must solve in O(log n) time.",
    example: "Input: nums=[4,5,6,7,0,1,2], target=0\nOutput: 4",
    signalWords: ["sorted", "rotated", "search", "O(log n)"],
    correctPattern: "Binary Search",
    patternIcon: "target",
    patternColor: "#A78BFA",
    whyThisPattern: "The requirement says O(log n) - that practically screams binary search. Even though the array is rotated, one half is ALWAYS sorted. We figure out which half is sorted, check if target is in that half, and eliminate the other half.",
    approach: [
      "Standard binary search setup: left, right, mid",
      "Check which HALF is sorted (compare mid with left)",
      "If target is in the sorted half, search there",
      "Otherwise, search the other half",
      "Key insight: one half is ALWAYS properly sorted",
    ],
    code: [
      "def search(nums, target):",
      "    left, right = 0, len(nums) - 1",
      "",
      "    while left <= right:",
      "        mid = (left + right) // 2",
      "        if nums[mid] == target:",
      "            return mid",
      "",
      "        if nums[left] <= nums[mid]:",
      "            if nums[left] <= target < nums[mid]:",
      "                right = mid - 1",
      "            else:",
      "                left = mid + 1",
      "        else:",
      "            if nums[mid] < target <= nums[right]:",
      "                left = mid + 1",
      "            else:",
      "                right = mid - 1",
      "",
      "    return -1",
    ],
    walkthrough: [
      { hl: [0, 1], note: "Array is [4,5,6,7,0,1,2], target=0. Set left=0, right=6." },
      { hl: [3, 4, 5], note: "mid=3, nums[3]=7. Not our target 0." },
      { hl: [8, 9], note: "Is left half sorted? nums[0]=4 <= nums[3]=7, YES. Is target in [4,7)? 0 is not in that range." },
      { hl: [11, 12], note: "So search the RIGHT half. left = mid+1 = 4." },
      { hl: [3, 4, 5, 6], note: "mid=5, nums[5]=1. Not target. Left half [0,1] is sorted. Is 0 in [0,1)? YES! right=mid-1=4." },
      { hl: [3, 4, 5, 6], note: "mid=4, nums[4]=0. FOUND! Return 4. Even in a rotated array, binary search works by finding the sorted half." },
    ],
    complexity: "O(log n) time, O(1) space",
    bruteForce: "O(n) - linear scan",
  },
  {
    id: "p4",
    title: "Number of Islands",
    difficulty: "Medium",
    diffColor: "#F59E0B",
    source: "LeetCode 200",
    desc: "Given a 2D grid of '1's (land) and '0's (water), count the number of islands. An island is surrounded by water and is formed by connecting adjacent lands horizontally or vertically.",
    example: "Input: [\n  ['1','1','0','0'],\n  ['1','1','0','0'],\n  ['0','0','1','0'],\n  ['0','0','0','1']\n]\nOutput: 3",
    signalWords: ["grid", "connected", "adjacent", "count components"],
    correctPattern: "BFS / Level Order",
    patternIcon: "network",
    patternColor: "#06B6D4",
    whyThisPattern: "We need to explore CONNECTED regions in a grid. When we find a '1', we use BFS to flood-fill the entire island (mark all connected '1's as visited). Each time we start a new BFS = one new island found.",
    approach: [
      "Scan the grid cell by cell",
      "When you find a '1' that is not visited: new island found!",
      "Use BFS to mark ALL connected '1's as visited",
      "Continue scanning. Each new unvisited '1' = another island",
    ],
    code: [
      "from collections import deque",
      "",
      "def num_islands(grid):",
      "    count = 0",
      "    rows, cols = len(grid), len(grid[0])",
      "",
      "    for r in range(rows):",
      "        for c in range(cols):",
      "            if grid[r][c] == '1':",
      "                count += 1",
      "                queue = deque([(r, c)])",
      "                grid[r][c] = '0'",
      "                while queue:",
      "                    row, col = queue.popleft()",
      "                    for dr, dc in [(-1,0),(1,0),(0,-1),(0,1)]:",
      "                        nr, nc = row+dr, col+dc",
      "                        if 0<=nr<rows and 0<=nc<cols and grid[nr][nc]=='1':",
      "                            grid[nr][nc] = '0'",
      "                            queue.append((nr, nc))",
      "    return count",
    ],
    walkthrough: [
      { hl: [2, 3, 4], note: "Set up: count islands, get grid dimensions." },
      { hl: [6, 7, 8, 9], note: "Scan grid. Hit grid[0][0]='1'. New island! count=1. Start BFS from here." },
      { hl: [10, 11, 12, 13], note: "BFS floods the entire first island. Mark [0][0], [0][1], [1][0], [1][1] all as '0' (visited). That whole top-left block = 1 island." },
      { hl: [6, 7, 8, 9], note: "Continue scanning. Hit grid[2][2]='1'. New island! count=2. BFS marks it visited." },
      { hl: [6, 7, 8, 9], note: "Continue. Hit grid[3][3]='1'. New island! count=3. BFS marks it. Scan finishes." },
      { hl: [19], note: "Return 3. The pattern: scan + BFS flood fill. Every time BFS starts = 1 island. Works for any connected component problem!" },
    ],
    complexity: "O(rows * cols) time and space",
    bruteForce: "Same complexity, but BFS is the natural approach here",
  },
  {
    id: "p5",
    title: "Coin Change",
    difficulty: "Medium",
    diffColor: "#F59E0B",
    source: "LeetCode 322",
    desc: "Given coins of different denominations and a total amount, return the fewest number of coins needed to make that amount. If not possible, return -1.",
    example: "Input: coins=[1,5,11], amount=15\nOutput: 3\nExplanation: 5+5+5=15 (NOT 11+1+1+1+1 which is 5 coins. Greedy fails here!)",
    signalWords: ["fewest", "minimum", "number of", "make amount", "coins"],
    correctPattern: "Dynamic Programming",
    patternIcon: "lightbulb",
    patternColor: "#10B981",
    whyThisPattern: "'Minimum number of' + choices at each step + overlapping sub-problems = DP. Greedy (always pick largest coin) FAILS here (11+1+1+1+1=5 coins vs 5+5+5=3). We need to try all options and build up from small amounts.",
    approach: [
      "Create dp array where dp[i] = min coins for amount i",
      "Base case: dp[0] = 0 (zero coins for zero amount)",
      "For each amount 1 to target: try each coin",
      "dp[amount] = min(dp[amount], dp[amount - coin] + 1)",
      "Build from bottom up: small amounts solve big amounts",
    ],
    code: [
      "def coin_change(coins, amount):",
      "    dp = [float('inf')] * (amount + 1)",
      "    dp[0] = 0",
      "",
      "    for i in range(1, amount + 1):",
      "        for coin in coins:",
      "            if coin <= i:",
      "                dp[i] = min(dp[i], dp[i - coin] + 1)",
      "",
      "    if dp[amount] == float('inf'):",
      "        return -1",
      "    return dp[amount]",
    ],
    walkthrough: [
      { hl: [0, 1, 2], note: "Create dp array. dp[0]=0, all others = infinity (not yet solved). We will fill in the minimum coins for each amount." },
      { hl: [4, 5, 6, 7], note: "For amount=1: try coin 1 (1<=1, dp[0]+1=1). dp[1]=1. For amount=5: try 1 (dp[4]+1=5) and 5 (dp[0]+1=1). dp[5]=1!" },
      { hl: [4, 5, 6, 7], note: "For amount=10: dp[10-5]+1 = dp[5]+1 = 2. Two 5-coins. For amount=11: dp[11-11]+1 = dp[0]+1 = 1. One 11-coin!" },
      { hl: [4, 5, 6, 7], note: "For amount=15: dp[15-1]+1=?, dp[15-5]+1=dp[10]+1=3, dp[15-11]+1=dp[4]+1=5. Minimum is 3! Three 5-coins beats one 11 plus four 1s." },
      { hl: [9, 10, 11], note: "dp[15]=3. Return 3. DP found the optimal solution that greedy would have missed. Each cell builds on previously solved sub-problems." },
    ],
    complexity: "O(amount * coins) time, O(amount) space",
    bruteForce: "O(amount^n) recursive without memoization",
  },
];

/* ════════ FRAMEWORK: The universal problem-solving attack plan ════════ */
const FRAMEWORK = [
  { num: 1, title: "Read and Draw", icon: "eye", color: "#FF6B6B",
    desc: "Read the problem 3 times. Draw the input/output. Write down edge cases (empty, single element, duplicates). What EXACTLY is being asked?",
    tips: ["Underline the key constraint", "Draw a small example by hand", "Ask: what is the INPUT type? what is the OUTPUT type?"] },
  { num: 2, title: "Spot the Signals", icon: "search", color: "#4ECDC4",
    desc: "Look for SIGNAL WORDS that reveal the pattern. These are your cheat codes.",
    tips: ["'sorted' + 'search' = Binary Search", "'substring' + 'longest' = Sliding Window", "'all combinations' = Backtracking", "'minimum cost' + choices = DP", "'shortest path' = BFS"] },
  { num: 3, title: "Match the Pattern", icon: "puzzle", color: "#A78BFA",
    desc: "Based on signals, identify 1-2 candidate patterns. Ask: does this pattern's core idea apply to my problem?",
    tips: ["Does it need two ends meeting? Two Pointers", "Does it have overlapping sub-problems? DP", "Is it about connected regions? BFS/DFS", "When unsure, start with brute force and optimize"] },
  { num: 4, title: "Plan Before Coding", icon: "plan", color: "#F59E0B",
    desc: "Explain your approach in PLAIN ENGLISH first. This is what impresses interviewers more than code. Walk through your example by hand.",
    tips: ["'I will use two pointers because...'", "Trace through your small example step by step", "Identify the data structures you need", "This step alone puts you in top 20%"] },
  { num: 5, title: "Code It Clean", icon: "code", color: "#EC4899",
    desc: "Now write the code. Use meaningful variable names. Start simple. Do not optimize prematurely.",
    tips: ["Write the skeleton/structure first", "Fill in the logic piece by piece", "If stuck, write brute force first, then optimize", "Talk while you code in interviews"] },
  { num: 6, title: "Test and Analyze", icon: "test", color: "#10B981",
    desc: "Trace through your code with the example. Try edge cases. State your time and space complexity clearly.",
    tips: ["Walk through with the given example", "Try: empty input, single element, all same values", "State: 'This is O(n) time because we visit each element once'", "Ask: 'Can I do better?' and explain why or why not"] },
];

/* ════════════ MAIN ════════════ */
export default function App() {
  const [tab, setTab] = useState("patterns");
  const [sel, setSel] = useState(null);
  const [si, setSi] = useState(0);
  const [ca, setCa] = useState(null);
  const [cr, setCr] = useState(false);
  const [done, setDone] = useState(new Set());
  // Problem Lab state
  const [labProblem, setLabProblem] = useState(null);
  const [labStep, setLabStep] = useState(0);
  const [labAnswer, setLabAnswer] = useState(null);
  const [labAnswered, setLabAnswered] = useState(false);
  const [solvedProblems, setSolvedProblems] = useState(new Set());

  // Auto-scroll ref — anchored at the top of walkthrough content
  var topRef = useRef(null);
  function scrollUp() {
    if (topRef.current) {
      topRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  const pat = sel;
  const step = pat ? pat.steps[si] : null;
  const last = pat && si === pat.steps.length - 1;

  function goNext() {
    if (step && step.challenge && !cr) return;
    if (last) {
      setDone(function (s) { return new Set([...s, pat.id]); });
      setSel(null);
      setSi(0);
    } else {
      setSi(function (s) { return s + 1; });
      setCa(null);
      setCr(false);
      setTimeout(scrollUp, 60);
    }
  }

  function goPrev() {
    if (si > 0) {
      setSi(function (s) { return s - 1; });
      setCa(null);
      setCr(false);
      setTimeout(scrollUp, 60);
    }
  }

  function pickPattern(p) {
    setSel(p);
    setSi(0);
    setCa(null);
    setCr(false);
    setTimeout(scrollUp, 60);
  }

  function handleAnswer(i) {
    if (cr) return;
    setCa(i);
    setCr(true);
  }

  function pickProblem(prob) {
    setLabProblem(prob);
    setLabStep(0);
    setLabAnswer(null);
    setLabAnswered(false);
    setTimeout(scrollUp, 60);
  }

  function labNextStep() {
    if (labStep === 0 && !labAnswered) return;
    var maxSteps = 2 + (labProblem ? labProblem.walkthrough.length : 0);
    if (labStep + 1 >= maxSteps) {
      setSolvedProblems(function (s) { return new Set([...s, labProblem.id]); });
      setLabProblem(null);
      setLabStep(0);
    } else {
      setLabStep(function (s) { return s + 1; });
      setLabAnswer(null);
      setLabAnswered(false);
      setTimeout(scrollUp, 60);
    }
  }

  function labPrevStep() {
    if (labStep > 0) {
      setLabStep(function (s) { return s - 1; });
      setLabAnswer(null);
      setLabAnswered(false);
      setTimeout(scrollUp, 60);
    }
  }

  function handleLabAnswer(i) {
    if (labAnswered) return;
    setLabAnswer(i);
    setLabAnswered(true);
  }

  var allPatternNames = P.map(function (p) { return p.name; });

  return (
    <div style={{ minHeight: "100vh", background: "#050507", color: "#E2E2E8", fontFamily: "'Outfit',sans-serif", position: "relative" }}>
      {/* Aurora Shader Background */}
      <ShaderBG />
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@300;400;500&family=Outfit:wght@300;400;500;600;700;800;900&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        ::-webkit-scrollbar{width:5px}::-webkit-scrollbar-track{background:transparent}::-webkit-scrollbar-thumb{background:#222;border-radius:3px}

        /* ── BlurFade (inspired by 21st.dev blur-fade) ── */
        @keyframes blurFadeIn{from{opacity:0;filter:blur(8px);transform:translateY(16px)}to{opacity:1;filter:blur(0px);transform:translateY(0)}}
        @keyframes blurFadeInSoft{from{opacity:0;filter:blur(4px);transform:translateY(8px)}to{opacity:1;filter:blur(0px);transform:translateY(0)}}
        .blur-in{animation:blurFadeIn 0.6s cubic-bezier(0.16,1,0.3,1) both}
        .blur-in-soft{animation:blurFadeInSoft 0.4s cubic-bezier(0.16,1,0.3,1) both}

        /* ── Core keyframes ── */
        @keyframes fadeUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
        @keyframes popIn{from{opacity:0;transform:scale(0.85)}to{opacity:1;transform:scale(1)}}
        @keyframes slideR{from{opacity:0;transform:translateX(-16px)}to{opacity:1;transform:translateX(0)}}
        @keyframes glowP{0%,100%{box-shadow:0 0 12px rgba(245,158,11,0.1)}50%{box-shadow:0 0 28px rgba(245,158,11,0.22)}}

        /* ── GlowingEffect border (inspired by 21st.dev glowing-effect) ── */
        @keyframes borderGlow{
          0%{background-position:0% 50%}
          50%{background-position:100% 50%}
          100%{background-position:0% 50%}
        }

        /* ── Flowing rotating border glow (core of 21st.dev glowing-effect) ── */
        @keyframes flowRotate{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
        .flow-border{position:relative;overflow:hidden;z-index:0}
        .flow-border::before{
          content:'';position:absolute;z-index:-1;
          top:-50%;left:-50%;width:200%;height:200%;
          background:conic-gradient(transparent 0deg,transparent 240deg,var(--flow-color,rgba(167,139,250,0.35)) 270deg,var(--flow-color2,rgba(103,232,249,0.25)) 290deg,transparent 310deg,transparent 360deg);
          animation:flowRotate 3s linear infinite;
          opacity:var(--flow-opacity,0.8);
        }
        .flow-border::after{
          content:'';position:absolute;z-index:-1;
          inset:1.5px;border-radius:inherit;background:var(--flow-bg,#050507);
        }
        .flow-border-fast::before{animation-duration:2s}
        .flow-border-amber{--flow-color:rgba(245,158,11,0.4);--flow-color2:rgba(251,191,36,0.3)}
        .flow-border-emerald{--flow-color:rgba(16,185,129,0.4);--flow-color2:rgba(52,211,153,0.3)}
        .flow-border-rose{--flow-color:rgba(236,72,153,0.4);--flow-color2:rgba(244,114,182,0.3)}
        .flow-border-cyan{--flow-color:rgba(6,182,212,0.4);--flow-color2:rgba(103,232,249,0.3)}
        .flow-border-red{--flow-color:rgba(239,68,68,0.35);--flow-color2:rgba(248,113,113,0.25)}
        .flow-border-subtle::before{opacity:0.4}

        /* Active cell glow ring (for pointer/mid/window cells) */
        @keyframes cellPulseGlow{0%,100%{box-shadow:0 0 8px var(--cell-glow,rgba(167,139,250,0.3)),inset 0 0 4px var(--cell-glow,rgba(167,139,250,0.1))}50%{box-shadow:0 0 18px var(--cell-glow,rgba(167,139,250,0.5)),inset 0 0 8px var(--cell-glow,rgba(167,139,250,0.15))}}
        .cell-active-glow{animation:cellPulseGlow 1.8s ease-in-out infinite}

        .glow-card{position:relative;overflow:hidden;transition:all 0.4s cubic-bezier(0.34,1.56,0.64,1)}
        .glow-card::before{
          content:'';position:absolute;inset:-1px;border-radius:inherit;padding:1px;
          background:linear-gradient(135deg,transparent 40%,rgba(167,139,250,0.15) 50%,transparent 60%);
          background-size:200% 200%;
          -webkit-mask:linear-gradient(#fff 0 0) content-box,linear-gradient(#fff 0 0);
          -webkit-mask-composite:xor;mask-composite:exclude;
          opacity:0;transition:opacity 0.4s ease;
        }
        .glow-card:hover::before{opacity:1;animation:borderGlow 3s ease infinite}
        .glow-card:hover{transform:translateY(-6px) scale(1.02);box-shadow:0 8px 30px -10px rgba(167,139,250,0.15)}
        .glow-card:hover .dot-pattern{opacity:0.6!important}

        /* ── Challenge glow (amber variant with flow) ── */
        .glow-challenge{position:relative;overflow:hidden;z-index:0}
        .glow-challenge::before{
          content:'';position:absolute;z-index:-1;
          top:-50%;left:-50%;width:200%;height:200%;
          background:conic-gradient(transparent 0deg,transparent 250deg,rgba(245,158,11,0.35) 275deg,rgba(251,191,36,0.25) 295deg,transparent 320deg,transparent 360deg);
          animation:flowRotate 4s linear infinite;
        }
        .glow-challenge::after{
          content:'';position:absolute;z-index:-1;
          inset:1.5px;border-radius:inherit;
          background:linear-gradient(135deg,rgba(245,158,11,0.06),rgba(245,158,11,0.02),#050507);
        }

        /* ── Lamp header glow (inspired by 21st.dev lamp) ── */
        .lamp-glow{position:relative}
        .lamp-glow::before{
          content:'';position:absolute;top:-60px;left:50%;transform:translateX(-50%);
          width:clamp(200px,50vw,400px);height:120px;
          background:radial-gradient(ellipse at center,rgba(167,139,250,0.12) 0%,rgba(6,182,212,0.06) 40%,transparent 70%);
          filter:blur(40px);pointer-events:none;
        }
        .lamp-glow::after{
          content:'';position:absolute;top:-20px;left:50%;transform:translateX(-50%);
          width:clamp(100px,30vw,240px);height:2px;
          background:linear-gradient(90deg,transparent,rgba(167,139,250,0.5),rgba(103,232,249,0.4),rgba(167,139,250,0.5),transparent);
          border-radius:2px;filter:blur(0.5px);pointer-events:none;
        }

        /* ── Bento Grid (inspired by 21st.dev bento-grid) ── */
        .bento-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:12px}
        .bento-featured{grid-column:span 1}
        @media(min-width:600px){
          .bento-grid{grid-template-columns:repeat(3,1fr)}
          .bento-featured{grid-column:span 2}
        }

        /* ── Dot pattern overlay (from bento-grid reference) ── */
        .dot-pattern{
          background-image:radial-gradient(circle at center,rgba(255,255,255,0.03) 1px,transparent 1px);
          background-size:6px 6px;
        }

        /* ── Existing styles ── */
        .card-h{cursor:pointer}

        /* ── Bento-style note cards (replaces left-bar accent) ── */
        .note-card{
          position:relative;
          border-radius:14px;
          overflow:hidden;
          animation:slideR 0.4s ease;
        }
        .note-card::before{
          content:'';position:absolute;inset:0;
          border-radius:inherit;
          background:var(--nc-gradient);
          opacity:0.55;
          pointer-events:none;
        }
        .note-card-dot{
          position:absolute;inset:0;border-radius:inherit;
          background-image:radial-gradient(circle at center,rgba(255,255,255,0.025) 1px,transparent 1px);
          background-size:8px 8px;
          pointer-events:none;
        }
        .note-card-inner{position:relative;z-index:1}
        .note-card-accent{
          width:6px;height:6px;border-radius:50%;
          display:inline-block;vertical-align:middle;
          margin-right:8px;flex-shrink:0;
        }
        .btn-p{transition:all 0.2s ease;cursor:pointer}.btn-p:hover{transform:translateY(-1px);filter:brightness(1.1)}.btn-p:active{transform:scale(0.97)}
        .ch-opt{transition:all 0.2s ease;cursor:pointer}.ch-opt:hover{transform:translateX(4px);background:rgba(255,255,255,0.06)!important}
        /* ── Visualization cells (consistent sizing + label slots) ── */
        :root{--cell:48px;--cell-font:15px;--cell-r:10px;--cell-gap:4px}
        @media(max-width:499px){:root{--cell:38px;--cell-font:12px;--cell-r:8px;--cell-gap:3px}}

        .viz-wrap{display:flex;gap:var(--cell-gap);justify-content:center;flex-wrap:wrap;padding:8px 0;align-items:flex-start}

        /* Each cell is a column: box → index → tag, with proper slots */
        .viz-cell{
          display:flex;flex-direction:column;align-items:center;
          gap:0;
          min-height:calc(var(--cell) + 36px);
        }
        /* The box itself — give it bottom margin so scale(1.12) doesn't eat into label space */
        .viz-cell > div:first-child{margin-bottom:4px}

        /* Index label: [0], [1], etc. */
        .idx-label{
          font-size:8px;color:#444;font-family:'DM Mono',monospace;
          line-height:1;padding:1px 0;
        }

        /* Tag label: LEFT, RIGHT, MID, +IN, -OUT, slow, fast, etc. */
        .cell-tag{
          font-size:8px;font-weight:700;line-height:1;
          min-height:12px;
          margin-top:3px;
          display:flex;align-items:center;justify-content:center;
        }

        /* Bounce goes DOWN (away from index), not up */
        @keyframes bounceTag{0%,100%{transform:translateY(0)}50%{transform:translateY(2px)}}
        .cell-tag-bounce{animation:bounceTag 1.2s ease-in-out infinite}

        /* Shared group styles */
        .viz-cell-col{display:flex;flex-direction:column;align-items:center;gap:6px}
        .viz-label{font-size:10px;color:#888;font-weight:600;letter-spacing:1px}

        /* Linked list layout — same spacing logic */
        .ll-wrap{display:flex;justify-content:center;align-items:flex-start;flex-wrap:wrap;padding:10px 0;gap:0}
        .ll-node-group{display:flex;align-items:flex-start;gap:0}
        .ll-node{
          display:flex;flex-direction:column;align-items:center;
          gap:0;min-height:calc(var(--cell) + 28px);
        }
        .ll-node > div:first-child{margin-bottom:4px}
        .ll-arrow{display:flex;align-items:center;height:var(--cell);padding:0 3px;color:#333;font-size:13px;font-family:'DM Mono',monospace}
        .ll-cycle{display:flex;align-items:center;height:var(--cell);color:rgba(245,158,11,0.5);font-size:10px;margin-left:4px;font-family:'DM Mono',monospace}
        /* BFS graph responsive */
        .graph-svg{width:100%;max-width:340px;height:auto}
        @media(max-width:399px){.graph-svg{max-width:280px}}
        /* Stack/HashMap responsive */
        .dual-viz{display:flex;gap:16px;justify-content:center;align-items:flex-end;flex-wrap:wrap;padding:8px 0}
        @media(max-width:399px){.dual-viz{gap:10px}.dual-viz .viz-label{font-size:9px}}
        .code-wrap{background:#060609;border-radius:10px;padding:10px 0;border:1px solid rgba(255,255,255,0.06);overflow-x:auto}
        .line-num{width:24px;text-align:right;font-size:10px;flex-shrink:0;padding-top:1.5px;font-family:'DM Mono',monospace}
        .pattern-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:12px}
        /* ── Step Navigation (sticky bottom always) ── */
        .step-nav{
          position:fixed;bottom:0;left:0;right:0;z-index:50;
          margin:0;padding:12px clamp(16px,3vw,24px);
          border-top:1px solid rgba(255,255,255,0.08);
          background:rgba(5,5,7,0.92);
          backdrop-filter:blur(16px);-webkit-backdrop-filter:blur(16px);
        }

        /* ── Step Layout: two columns, one screen ── */
        .step-layout{
          display:grid;gap:12px;grid-template-columns:1fr;
          max-height:calc(100vh - 130px);
          overflow-y:auto;
          scrollbar-width:thin;scrollbar-color:#222 transparent;
        }
        .step-layout::-webkit-scrollbar{width:4px}
        .step-layout::-webkit-scrollbar-thumb{background:#222;border-radius:2px}
        .step-col{display:flex;flex-direction:column;gap:10px;min-width:0}

        @media(min-width:900px){
          .step-layout{
            grid-template-columns:1fr 1fr;
            overflow:hidden;
          }
          .step-col{
            overflow-y:auto;max-height:calc(100vh - 130px);
            padding-right:6px;
            scrollbar-width:thin;scrollbar-color:#222 transparent;
          }
          .step-col::-webkit-scrollbar{width:4px}
          .step-col::-webkit-scrollbar-thumb{background:#222;border-radius:2px}
        }

        .side-panel{background:rgba(255,255,255,0.02);border:1px solid rgba(255,255,255,0.06);border-radius:9px;padding:10px 12px;font-size:11px;color:#AAA;font-family:'DM Mono',monospace;line-height:1.7;white-space:pre-line;align-self:start}
        .tab-btn{transition:all 0.25s ease;cursor:pointer;border:none;outline:none}
        .tab-btn:hover{transform:translateY(-2px)}
        @media(max-width:599px){
          .viz-wrap{gap:3px}
          .pattern-grid,.bento-grid{grid-template-columns:1fr!important}
          .bento-featured{grid-column:span 1!important}
          .nav-hint{display:none!important}
          .line-num{width:18px;font-size:9px}
        }
        @media(min-width:600px) and (max-width:899px){
          .pattern-grid{grid-template-columns:repeat(2,1fr)!important}
          .bento-grid{grid-template-columns:repeat(2,1fr)!important}
        }
      `}</style>

      <div style={{ maxWidth: sel || labProblem ? 1100 : 860, margin: "0 auto", padding: "clamp(14px,3vw,24px) clamp(10px,3vw,16px) 50px", position: "relative", zIndex: 1, transition: "max-width 0.3s ease" }}>

        {/* HEADER with Lamp Glow */}
        <div className="lamp-glow" style={{ textAlign: "center", marginBottom: 16, paddingTop: 20 }}>
          <div className="blur-in" style={{ display: "inline-block", fontSize: 10, letterSpacing: 3, color: "#A78BFA", fontWeight: 600, marginBottom: 8, padding: "3px 12px", borderRadius: 20, background: "rgba(167,139,250,0.08)", border: "1px solid rgba(167,139,250,0.15)", animationDelay: "0.1s" }}>INTERACTIVE LEARNING</div>
          <h1 className="blur-in" style={{ fontSize: "clamp(26px,5.5vw,46px)", fontWeight: 900, lineHeight: 1.05, marginBottom: 8, background: "linear-gradient(135deg,#C4B5FD,#67E8F9,#6EE7B7)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", animationDelay: "0.2s" }}>The Pattern Dojo</h1>
        </div>

        {/* TABS */}
        {!sel && !labProblem && (
          <div style={{ display: "flex", gap: 6, marginBottom: 24, flexWrap: "wrap", justifyContent: "center" }}>
            {[
              { id: "patterns", label: "Learn Patterns", desc: "10 core patterns" },
              { id: "lab", label: "Problem Lab", desc: "Apply to real problems" },
              { id: "framework", label: "Attack Plan", desc: "6-step framework" },
            ].map(function (t, idx) {
              var active = tab === t.id;
              return (
                <button key={t.id} className="tab-btn blur-in" onClick={function () { setTab(t.id); }} style={{
                  padding: "10px 20px", borderRadius: 12,
                  background: active ? "linear-gradient(135deg, #A78BFA22, #06B6D418)" : "rgba(255,255,255,0.03)",
                  color: active ? "#E8E8ED" : "#666",
                  fontSize: 13, fontFamily: "Outfit",
                  fontWeight: active ? 600 : 400,
                  border: active ? "1px solid rgba(167,139,250,0.3)" : "1px solid rgba(255,255,255,0.06)",
                  animationDelay: (0.1 + idx * 0.06) + "s",
                }}>
                  <div>{t.label}</div>
                  <div style={{ fontSize: 10, opacity: 0.6, marginTop: 2 }}>{t.desc}</div>
                </button>
              );
            })}
          </div>
        )}

        {/* ═══ PATTERNS TAB (Bento + Glow) ═══ */}
        {!sel && !labProblem && tab === "patterns" && (
          <div className="blur-in">
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
              <div style={{ fontSize: 12, color: "#888", fontWeight: 500 }}>Choose a pattern</div>
              <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.06)" }} />
              <div style={{ fontSize: 11, color: "#555" }}>{done.size}/{P.length} done</div>
            </div>
            <div className="bento-grid">
              {P.map(function (p, i) {
                var d = done.has(p.id);
                var featured = p.id === "two-pointers" || p.id === "dp";
                return (
                  <div key={p.id} className={"glow-card" + (featured ? " bento-featured" : "")} onClick={function () { pickPattern(p); }} style={{ background: "linear-gradient(145deg," + p.color + "0A," + p.color + "03)", border: "1px solid " + p.color + (d ? "40" : "18"), borderRadius: 16, padding: "clamp(16px,3vw,22px) clamp(14px,3vw,20px)", animation: "blurFadeIn " + (0.5 + i * 0.06) + "s cubic-bezier(0.16,1,0.3,1) both", animationDelay: (i * 0.04) + "s", position: "relative", overflow: "hidden", cursor: "pointer" }}>
                    {/* Dot pattern overlay (bento-grid reference) */}
                    <div className="dot-pattern" style={{ position: "absolute", inset: 0, opacity: 0, transition: "opacity 0.4s", borderRadius: "inherit" }} />
                    {d && <div style={{ position: "absolute", top: 10, right: 10, fontSize: 9, background: p.color + "20", color: p.color, padding: "2px 8px", borderRadius: 16, fontWeight: 600, display: "flex", alignItems: "center", gap: 3, zIndex: 2 }}><Check size={10} />Done</div>}
                    <div style={{ position: "relative", zIndex: 1 }}>
                      <div style={{ marginBottom: 10, opacity: 0.85 }}><PatIcon name={p.icon} size={featured ? 36 : 30} color={p.color} /></div>
                      <div style={{ fontWeight: 700, fontSize: featured ? "clamp(15px,3vw,18px)" : "clamp(13px,3vw,16px)", color: p.color, marginBottom: 4 }}>{p.name}</div>
                      <div style={{ fontSize: featured ? 12 : 11, color: "#777", lineHeight: 1.6, fontWeight: 300, marginBottom: 12 }}>{p.tagline}</div>
                      <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginBottom: 12 }}>
                        {p.signals.slice(0, featured ? 4 : 2).map(function (s) {
                          return <span key={s} style={{ fontSize: 9, padding: "3px 8px", borderRadius: 6, background: p.color + "0D", color: p.color + "CC", border: "1px solid " + p.color + "1A", fontFamily: "'DM Mono'" }}>{s}</span>;
                        })}
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <div style={{ fontSize: 11, color: p.color, fontWeight: 600, display: "flex", alignItems: "center", gap: 3 }}>Start<ChevronRight size={14} color={p.color} /></div>
                        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                          <span style={{ fontSize: 10, color: "#555" }}>{p.complexity}</span>
                          <span style={{ fontSize: 10, color: "#444" }}>{p.steps.length} steps</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ═══ PROBLEM LAB TAB ═══ */}
        {!sel && !labProblem && tab === "lab" && (
          <div className="blur-in">
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
              <div style={{ fontSize: 12, color: "#888", fontWeight: 500 }}>Solve real problems end-to-end</div>
              <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.06)" }} />
              <div style={{ fontSize: 11, color: "#555" }}>{solvedProblems.size}/{PROBLEMS.length} solved</div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {PROBLEMS.map(function (prob, i) {
                var solved = solvedProblems.has(prob.id);
                return (
                  <div key={prob.id} className="glow-card" onClick={function () { pickProblem(prob); }} style={{
                    background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.08)",
                    borderRadius: 16, padding: "clamp(14px,3vw,20px)", animation: "blurFadeIn " + (0.5 + i * 0.08) + "s cubic-bezier(0.16,1,0.3,1) both",
                    display: "flex", alignItems: "center", gap: 16, position: "relative", cursor: "pointer",
                  }}>
                    {solved && <div style={{ position: "absolute", top: 10, right: 12, fontSize: 9, background: "rgba(16,185,129,0.15)", color: "#10B981", padding: "2px 8px", borderRadius: 16, fontWeight: 600, display: "flex", alignItems: "center", gap: 3 }}><Check size={10} />Solved</div>}
                    <div style={{ opacity: 0.7 }}><PatIcon name={prob.patternIcon} size={28} color={prob.patternColor} /></div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4, flexWrap: "wrap" }}>
                        <div style={{ fontWeight: 700, fontSize: 15, color: "#E2E2E8" }}>{prob.title}</div>
                        <span style={{ fontSize: 10, padding: "2px 8px", borderRadius: 10, background: prob.diffColor + "15", color: prob.diffColor, fontWeight: 600 }}>{prob.difficulty}</span>
                        <span style={{ fontSize: 10, color: "#555" }}>{prob.source}</span>
                      </div>
                      <div style={{ fontSize: 12, color: "#777", lineHeight: 1.5 }}>{prob.desc.slice(0, 100)}...</div>
                    </div>
                    <ChevronRight size={18} color="#555" />
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Scroll anchor for auto-scroll on step change */}
        <div ref={topRef} style={{ height: 0, overflow: "hidden" }} />

        {/* ═══ PROBLEM LAB WALKTHROUGH ═══ */}
        {labProblem && (
          <div style={{ animation: "fadeUp 0.3s ease", paddingBottom: 70 }}>
            <button className="btn-p" onClick={function () { setLabProblem(null); setLabStep(0); }} style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", color: "#AAA", padding: "7px 14px", borderRadius: 8, fontSize: 11, fontFamily: "Outfit", display: "flex", alignItems: "center", gap: 4, marginBottom: 16 }}><ChevronLeft size={14} />All Problems</button>

            {/* Problem header */}
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6, flexWrap: "wrap" }}>
              <span style={{ fontWeight: 800, fontSize: 20, color: "#E2E2E8" }}>{labProblem.title}</span>
              <span style={{ fontSize: 10, padding: "2px 8px", borderRadius: 10, background: labProblem.diffColor + "15", color: labProblem.diffColor, fontWeight: 600 }}>{labProblem.difficulty}</span>
              <span style={{ fontSize: 10, color: "#555" }}>{labProblem.source}</span>
            </div>

            {/* Progress */}
            <div style={{ display: "flex", gap: 3, marginBottom: 16 }}>
              {Array.from({ length: 2 + labProblem.walkthrough.length }).map(function (_, i) {
                return <div key={i} style={{ width: i === labStep ? 20 : 7, height: 7, borderRadius: 4, background: i <= labStep ? labProblem.patternColor : "rgba(255,255,255,0.08)", transition: "all 0.3s ease", opacity: i <= labStep ? 1 : 0.4 }} />;
              })}
            </div>

            {/* STEP 0: Read + Identify Pattern */}
            {labStep === 0 && (
              <div style={{ animation: "fadeUp 0.3s ease" }}>
                {/* Problem description */}
                <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12, padding: 18, marginBottom: 14 }}>
                  <div style={{ fontSize: 10, color: "#888", fontWeight: 600, letterSpacing: 1, marginBottom: 8 }}>THE PROBLEM</div>
                  <div style={{ fontSize: 14, color: "#DDD", lineHeight: 1.7 }}>{labProblem.desc}</div>
                </div>
                <div style={{ background: "#0C0E14", borderRadius: 10, padding: 16, border: "1px solid rgba(255,255,255,0.06)", marginBottom: 14 }}>
                  <div style={{ fontSize: 10, color: "#888", fontWeight: 600, letterSpacing: 1, marginBottom: 6 }}>EXAMPLE</div>
                  <pre style={{ fontSize: 12, color: "#AAA", fontFamily: "'DM Mono'", whiteSpace: "pre-wrap", lineHeight: 1.7 }}>{labProblem.example}</pre>
                </div>

                {/* Signal words */}
                <div style={{ background: "rgba(245,158,11,0.04)", border: "1px solid rgba(245,158,11,0.15)", borderRadius: 12, padding: 16, marginBottom: 14 }}>
                  <div style={{ fontSize: 10, color: "#F59E0B", fontWeight: 600, letterSpacing: 1, marginBottom: 8 }}>SIGNAL WORDS SPOTTED</div>
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                    {labProblem.signalWords.map(function (w) {
                      return <span key={w} style={{ fontSize: 12, padding: "5px 12px", borderRadius: 8, background: "rgba(245,158,11,0.1)", color: "#F59E0B", fontFamily: "'DM Mono'", border: "1px solid rgba(245,158,11,0.2)" }}>{w}</span>;
                    })}
                  </div>
                </div>

                {/* Pattern quiz */}
                <div className="glow-challenge" style={{ background: "linear-gradient(135deg,rgba(167,139,250,0.06),rgba(167,139,250,0.02))", border: "1px solid rgba(167,139,250,0.2)", borderRadius: 12, padding: 18 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 10 }}>
                    <CircleHelp size={18} color="#A78BFA" />
                    <span style={{ fontSize: 13, color: "#A78BFA", fontWeight: 700 }}>Which pattern fits this problem?</span>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
                    {allPatternNames.map(function (name, i) {
                      var isCorrect = name === labProblem.correctPattern;
                      var isSel = labAnswer === i;
                      var bg = "rgba(255,255,255,0.03)";
                      var bd = "rgba(255,255,255,0.08)";
                      var cl = "#AAA";
                      if (labAnswered && isCorrect) { bg = "rgba(16,185,129,0.12)"; bd = "rgba(16,185,129,0.3)"; cl = "#10B981"; }
                      if (labAnswered && isSel && !isCorrect) { bg = "rgba(239,68,68,0.08)"; bd = "rgba(239,68,68,0.2)"; cl = "#EF4444"; }
                      return (
                        <div key={name} className={labAnswered ? "" : "ch-opt"} onClick={function () { handleLabAnswer(i); }} style={{
                          padding: "8px 12px", borderRadius: 8, background: bg, border: "1px solid " + bd,
                          fontSize: 12, color: cl, fontWeight: labAnswered && isCorrect ? 600 : 400,
                          cursor: labAnswered ? "default" : "pointer",
                        }}>{name}</div>
                      );
                    })}
                  </div>
                  {labAnswered && (
                    <div style={{ marginTop: 12, padding: "12px 14px", borderRadius: 8, background: labProblem.patternColor + "0A", border: "1px solid " + labProblem.patternColor + "20", animation: "popIn 0.3s ease" }}>
                      <div style={{ fontSize: 13, color: labProblem.patternColor, fontWeight: 600, marginBottom: 6 }}>
                        {labAnswer === allPatternNames.indexOf(labProblem.correctPattern) ? "Correct!" : "The answer is: " + labProblem.correctPattern}
                      </div>
                      <div style={{ fontSize: 12, color: "#BBB", lineHeight: 1.6 }}>{labProblem.whyThisPattern}</div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* STEP 1: Approach + Code */}
            {labStep === 1 && (
              <div style={{ animation: "fadeUp 0.3s ease" }}>
                <div className="note-card" style={{ "--nc-gradient": "linear-gradient(135deg," + labProblem.patternColor + "0A," + labProblem.patternColor + "04,transparent)", background: "rgba(255,255,255,0.02)", border: "1px solid " + labProblem.patternColor + "18", padding: 18, marginBottom: 14 }}>
                  <div className="note-card-dot" />
                  <div className="note-card-inner">
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                      <div className="note-card-accent" style={{ background: labProblem.patternColor }} />
                      <div style={{ fontSize: 10, color: labProblem.patternColor, fontWeight: 600, letterSpacing: 1 }}>THE APPROACH</div>
                    </div>
                  {labProblem.approach.map(function (step, i) {
                    return (
                      <div key={i} style={{ display: "flex", gap: 10, marginBottom: 8, animation: "slideR " + (0.3 + i * 0.08) + "s ease" }}>
                        <div style={{ width: 22, height: 22, borderRadius: "50%", background: labProblem.patternColor + "20", color: labProblem.patternColor, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, flexShrink: 0 }}>{i + 1}</div>
                        <div style={{ fontSize: 13, color: "#CCC", lineHeight: 1.6 }}>{step}</div>
                      </div>
                    );
                  })}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: 9, color: "#555", fontWeight: 600, letterSpacing: 1, marginBottom: 6, display: "flex", alignItems: "center", gap: 4 }}><Code2 size={11} color="#555" />FULL SOLUTION</div>
                  <CodeBlock code={labProblem.code} hl={[]} color={labProblem.patternColor} />
                </div>
                <div style={{ marginTop: 12, display: "flex", gap: 12, flexWrap: "wrap" }}>
                  <div style={{ flex: 1, minWidth: 180, background: "rgba(16,185,129,0.05)", border: "1px solid rgba(16,185,129,0.15)", borderRadius: 10, padding: 14 }}>
                    <div style={{ fontSize: 10, color: "#10B981", fontWeight: 600, marginBottom: 4 }}>OPTIMIZED</div>
                    <div style={{ fontSize: 12, color: "#AAA", fontFamily: "'DM Mono'" }}>{labProblem.complexity}</div>
                  </div>
                  <div style={{ flex: 1, minWidth: 180, background: "rgba(239,68,68,0.04)", border: "1px solid rgba(239,68,68,0.12)", borderRadius: 10, padding: 14 }}>
                    <div style={{ fontSize: 10, color: "#EF4444", fontWeight: 600, marginBottom: 4 }}>BRUTE FORCE</div>
                    <div style={{ fontSize: 12, color: "#888", fontFamily: "'DM Mono'" }}>{labProblem.bruteForce}</div>
                  </div>
                </div>
              </div>
            )}

            {/* STEPS 2+: Code walkthrough */}
            {labStep >= 2 && (
              <div style={{ animation: "fadeUp 0.3s ease" }}>
                {(function () {
                  var wt = labProblem.walkthrough[labStep - 2];
                  return (
                    <div>
                      <div className="note-card" style={{ "--nc-gradient": "linear-gradient(135deg," + labProblem.patternColor + "0A," + labProblem.patternColor + "04,transparent)", background: "rgba(255,255,255,0.02)", border: "1px solid " + labProblem.patternColor + "18", padding: "16px 18px", marginBottom: 12 }}>
                        <div className="note-card-dot" />
                        <div className="note-card-inner">
                          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                            <div className="note-card-accent" style={{ background: labProblem.patternColor }} />
                            <div style={{ fontSize: 10, color: labProblem.patternColor, fontWeight: 600, letterSpacing: 1 }}>STEP-BY-STEP: {labStep - 1} of {labProblem.walkthrough.length}</div>
                          </div>
                          <div style={{ fontSize: 14, color: "#DDD", lineHeight: 1.75 }}>{wt.note}</div>
                        </div>
                      </div>
                      <div style={{ fontSize: 9, color: "#555", fontWeight: 600, letterSpacing: 1, marginBottom: 6, display: "flex", alignItems: "center", gap: 4 }}><Code2 size={11} color="#555" />CODE</div>
                      <CodeBlock code={labProblem.code} hl={wt.hl} color={labProblem.patternColor} />
                    </div>
                  );
                })()}
              </div>
            )}

            {/* Lab Navigation — sticky on mobile */}
            <div className="step-nav" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <button className="btn-p" onClick={labPrevStep} disabled={labStep === 0} style={{ background: labStep === 0 ? "rgba(255,255,255,0.02)" : "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: labStep === 0 ? "#333" : "#AAA", padding: "clamp(7px,1.5vw,10px) clamp(12px,2vw,20px)", borderRadius: 9, fontSize: 12, fontFamily: "Outfit", fontWeight: 500, cursor: labStep === 0 ? "not-allowed" : "pointer", display: "flex", alignItems: "center", gap: 4 }}><ChevronLeft size={14} />Prev</button>
              <div className="nav-hint" style={{ fontSize: 11, color: "#444" }}>{labStep === 0 && !labAnswered ? "Pick the pattern first" : ""}</div>
              <button className="btn-p" onClick={labNextStep} disabled={labStep === 0 && !labAnswered} style={{ background: labStep === 0 && !labAnswered ? "rgba(255,255,255,0.02)" : "linear-gradient(135deg," + labProblem.patternColor + "CC," + labProblem.patternColor + "88)", border: "none", color: labStep === 0 && !labAnswered ? "#444" : "#fff", padding: "clamp(7px,1.5vw,10px) clamp(14px,2vw,22px)", borderRadius: 9, fontSize: 12, fontWeight: 600, fontFamily: "Outfit", cursor: labStep === 0 && !labAnswered ? "not-allowed" : "pointer", display: "flex", alignItems: "center", gap: 4 }}>
                {labStep >= 1 + labProblem.walkthrough.length ? <><Check size={14} />Done</> : <>Next<ChevronRight size={14} /></>}
              </button>
            </div>
          </div>
        )}

        {/* ═══ FRAMEWORK TAB ═══ */}
        {!sel && !labProblem && tab === "framework" && (
          <div className="blur-in">
            <div style={{ textAlign: "center", marginBottom: 24 }}>
              <h2 style={{ fontWeight: 800, fontSize: 22, color: "#E8E8ED", marginBottom: 6 }}>The 6-Step Attack Plan</h2>
              <p style={{ color: "#666", fontSize: 13 }}>Use this for EVERY problem. It becomes muscle memory.</p>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {FRAMEWORK.map(function (f, i) {
                return (
                  <div key={i} className="note-card" style={{
                    "--nc-gradient": "linear-gradient(135deg," + f.color + "08," + f.color + "03,transparent)",
                    background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)",
                    padding: "18px 20px", animation: "slideR " + (0.3 + i * 0.07) + "s ease",
                  }}>
                    <div className="note-card-dot" />
                    <div className="note-card-inner">
                      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                        <div style={{ width: 36, height: 36, borderRadius: 10, background: f.color + "15", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, fontWeight: 800, color: f.color }}>{f.num}</div>
                        <div style={{ fontWeight: 700, fontSize: 16, color: "#E8E8ED" }}>{f.title}</div>
                      </div>
                      <div style={{ fontSize: 13, color: "#AAA", lineHeight: 1.7, marginBottom: 12 }}>{f.desc}</div>
                      <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                        {f.tips.map(function (tip, j) {
                          return (
                            <div key={j} style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
                              <ChevronRight size={14} color={f.color} style={{ flexShrink: 0, marginTop: 2 }} />
                              <div style={{ fontSize: 12, color: "#888", lineHeight: 1.5 }}>{tip}</div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            <div style={{ marginTop: 20, background: "linear-gradient(135deg,rgba(167,139,250,0.06),rgba(236,72,153,0.04))", borderRadius: 14, padding: 20, border: "1px solid rgba(167,139,250,0.12)" }}>
              <div style={{ fontSize: 10, color: "#A78BFA", fontWeight: 600, letterSpacing: 2, marginBottom: 8 }}>THE GOLDEN RULE</div>
              <div style={{ fontSize: 15, color: "#DDD", lineHeight: 1.7 }}>
                Never jump to code. The interviewer cares MORE about your thinking process than your code. Talk through Steps 1-4 out loud. This alone puts you in the top 20% of candidates.
              </div>
            </div>
          </div>
        )}

        {/* WALKTHROUGH */}
        {sel && step && (
          <div style={{ animation: "fadeUp 0.3s ease", paddingBottom: 70 }}>
            {/* Top Bar */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14, flexWrap: "wrap", gap: 8 }}>
              <button className="btn-p" onClick={function () { setSel(null); setSi(0); }} style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", color: "#AAA", padding: "7px 14px", borderRadius: 8, fontSize: 11, fontFamily: "Outfit", display: "flex", alignItems: "center", gap: 4 }}><ChevronLeft size={14} />Back</button>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ opacity: 0.85 }}><PatIcon name={pat.icon} size={20} color={pat.color} /></span>
                <span style={{ fontWeight: 700, fontSize: "clamp(13px,3vw,16px)", color: pat.color }}>{pat.name}</span>
              </div>
              <div style={{ fontSize: 11, color: "#555" }}>{pat.complexity}</div>
            </div>

            {/* Progress */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <div style={{ fontSize: 11, color: "#666" }}>Step {si + 1}/{pat.steps.length}</div>
              <div style={{ display: "flex", gap: 3 }}>
                {pat.steps.map(function (_, i) {
                  return <div key={i} style={{ width: i === si ? 20 : 7, height: 7, borderRadius: 4, background: i <= si ? pat.color : "rgba(255,255,255,0.08)", transition: "all 0.3s ease", opacity: i <= si ? 1 : 0.4 }} />;
                })}
              </div>
            </div>

            {/* ── Two-column step layout ── */}
            <div className="step-layout">
              {/* LEFT COLUMN: Story + Viz */}
              <div className="step-col">
                {/* Annotation */}
                <div className="note-card" style={{ "--nc-gradient": "linear-gradient(135deg," + pat.color + "0A," + pat.color + "04,transparent)", background: "rgba(255,255,255,0.02)", border: "1px solid " + pat.color + "18", padding: "clamp(12px,2vw,16px)" }}>
                  <div className="note-card-dot" />
                  <div className="note-card-inner">
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                      <div className="note-card-accent" style={{ background: pat.color }} />
                      <div style={{ fontSize: 10, color: pat.color, fontWeight: 600, letterSpacing: 1 }}>
                        {step.sum ? "KEY TAKEAWAY" : "STEP " + (si + 1)}
                      </div>
                    </div>
                    <div style={{ fontSize: 13, color: "#DDD", lineHeight: 1.75, fontWeight: 400, whiteSpace: "pre-line" }}>{step.note}</div>
                  </div>
                </div>

                {/* Visualization */}
                <div className="flow-border flow-border-subtle" style={{ "--flow-color": pat.color + "55", "--flow-color2": pat.color + "30", background: "rgba(255,255,255,0.015)", borderRadius: 12, padding: "clamp(8px,1.5vw,12px)" }}>
                  <div style={{ position: "relative", zIndex: 1 }}>
                    <div style={{ fontSize: 9, color: "#555", fontWeight: 600, letterSpacing: 1, marginBottom: 6, textAlign: "center", display: "flex", alignItems: "center", justifyContent: "center", gap: 5 }}><Eye size={11} color="#555" />VISUALIZATION</div>
                    <Viz step={step} pattern={pat} />
                  </div>
                </div>

                {/* Challenge */}
                {step.challenge && (
                  <div className="glow-challenge" style={{ background: "linear-gradient(135deg,rgba(245,158,11,0.06),rgba(245,158,11,0.02))", border: "1px solid rgba(245,158,11,0.2)", borderRadius: 12, padding: "10px 12px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
                      <CircleHelp size={14} color="#F59E0B" />
                      <span style={{ fontSize: 10, color: "#F59E0B", fontWeight: 700 }}>YOUR TURN</span>
                    </div>
                    <div style={{ fontSize: 12, color: "#DDD", marginBottom: 8, lineHeight: 1.5 }}>{step.challenge.q}</div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                      {step.challenge.opts.map(function (o, i) {
                        var isC = i === step.challenge.ans;
                        var isS = ca === i;
                        var bg = "rgba(255,255,255,0.04)", bd = "rgba(255,255,255,0.1)", cl = "#CCC";
                        if (cr && isC) { bg = "rgba(16,185,129,0.12)"; bd = "rgba(16,185,129,0.4)"; cl = "#10B981"; }
                        if (cr && isS && !isC) { bg = "rgba(239,68,68,0.1)"; bd = "rgba(239,68,68,0.3)"; cl = "#EF4444"; }
                        return (
                          <div key={i} className={cr ? "" : "ch-opt"} onClick={function () { handleAnswer(i); }} style={{ padding: "6px 10px", borderRadius: 7, background: bg, border: "1px solid " + bd, fontSize: 11, color: cl, fontWeight: cr && isC ? 600 : 400, cursor: cr ? "default" : "pointer", display: "flex", alignItems: "center", gap: 6 }}>
                            <span style={{ width: 18, height: 18, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", background: cr && isC ? "#10B98133" : cr && isS && !isC ? "#EF444433" : "rgba(255,255,255,0.05)", fontSize: 9, fontWeight: 700, flexShrink: 0, color: cr && isC ? "#10B981" : cr && isS && !isC ? "#EF4444" : "#888" }}>
                              {cr && isC ? "Y" : cr && isS && !isC ? "X" : String.fromCharCode(65 + i)}
                            </span>
                            {o}
                          </div>
                        );
                      })}
                    </div>
                    {cr && (
                      <div style={{ marginTop: 6, padding: "5px 8px", borderRadius: 6, background: ca === step.challenge.ans ? "rgba(16,185,129,0.08)" : "rgba(239,68,68,0.06)", fontSize: 11, color: ca === step.challenge.ans ? "#6EE7B7" : "#FCA5A5", fontWeight: 500 }}>
                        {ca === step.challenge.ans ? "Exactly right!" : "Not quite. Answer: " + step.challenge.opts[step.challenge.ans]}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* RIGHT COLUMN: Code + Memory + Explains + Side */}
              <div className="step-col">
                <div>
                  <div style={{ fontSize: 9, color: "#555", fontWeight: 600, letterSpacing: 1, marginBottom: 6, display: "flex", alignItems: "center", gap: 4 }}><Code2 size={11} color="#555" />CODE</div>
                  <CodeBlock code={pat.code} hl={step.hl} color={pat.color} />
                </div>
                {step.vars && Object.keys(step.vars).length > 0 && (
                  <MemoryView vars={step.vars} color={pat.color} stepIndex={si} />
                )}
                <CodeExplainer patternId={pat.id} hl={step.hl} color={pat.color} />
                {step.side && <div className="side-panel">{step.side}</div>}
              </div>
            </div>

            {/* Navigation — sticky on mobile */}
            <div className="step-nav" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <button className="btn-p" onClick={goPrev} disabled={si === 0} style={{ background: si === 0 ? "rgba(255,255,255,0.02)" : "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: si === 0 ? "#333" : "#AAA", padding: "clamp(7px,1.5vw,10px) clamp(12px,2vw,20px)", borderRadius: 9, fontSize: 12, fontFamily: "Outfit", fontWeight: 500, cursor: si === 0 ? "not-allowed" : "pointer", display: "flex", alignItems: "center", gap: 4 }}><ChevronLeft size={14} />Prev</button>
              <div className="nav-hint" style={{ fontSize: 11, color: "#444" }}>{step.challenge && !cr ? "Answer to continue" : ""}</div>
              <button className="btn-p" onClick={goNext} disabled={step.challenge && !cr} style={{ background: step.challenge && !cr ? "rgba(255,255,255,0.02)" : step.sum ? "linear-gradient(135deg," + pat.color + "," + pat.color + "AA)" : "linear-gradient(135deg," + pat.color + "CC," + pat.color + "88)", border: "none", color: step.challenge && !cr ? "#444" : "#fff", padding: "clamp(7px,1.5vw,10px) clamp(14px,2vw,22px)", borderRadius: 9, fontSize: 12, fontWeight: 600, fontFamily: "Outfit", cursor: step.challenge && !cr ? "not-allowed" : "pointer", boxShadow: !(step.challenge && !cr) ? "0 4px 16px " + pat.color + "33" : "none", display: "flex", alignItems: "center", gap: 4 }}>
                {last ? <><Check size={14} />Complete</> : <>Next<ChevronRight size={14} /></>}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
