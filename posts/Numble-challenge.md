---
layout: post
title: Numble Challenge  
tags: [numble, react, useReducer, typescript]
published: true 
date: "2022-02-28"
---

# numble-find-diff

[https://github.com/pjainxido/numble-find-diff](https://github.com/pjainxido/numble-find-diff)

๋ฐฐํฌ์ฃผ์: [https://numble-find-diff.vercel.app/](https://numble-find-diff.vercel.app/)

![Untitled](/postimgs/NumbleCh/Untitled.png)

## ๐ปย ์ฝ๋

```jsx
import type { NextPage } from 'next'
import FindDiffGame from '../components/FindDiffGame'

const Home: NextPage = () => {
  return (
    <>
      <FindDiffGame boardSide={360} timePenalty ={3} timePerStage={15} />
    </>
  )
}

export default Home
```

next.js๋ก ํ๋ก์ ํธ๋ฅผ ์์ฑํด pages ๋ด index.tsx์ FindDiffgame ์ปดํฌ๋ํธ๋ฅผ ์ถ๊ฐํ์ต๋๋ค.

```jsx
interface IFindDiffGame {
  boardSide: number;
  timePenalty: number;
  timePerStage: number;
}

const FindDiffGame: React.FC<IFindDiffGame> = ({ boardSide, timePenalty, timePerStage }) => {
  const [state, dispatch] = useReducer(gameReducer, initialState);
  const { isPlaying, stage, score, time, answer, defaultColor, answerColor } = state;
```

์ ์ฒด์ ์ธ ๊ฒ์ ์ปดํฌ๋ํธ๋ก, props๋ก ๊ฒ์ํ์ ํ๋ณ์ ๊ธธ์ด, ์คํจ์ ํจ๋ํฐ ์๊ฐ, ์คํ์ด์ง๋น ์๊ฐ ์ต์์ ์ถ๊ฐํ์ฌ ์ปค์คํ ๊ฐ๋ฅํ๊ฒ ์ค์ ํ์ต๋๋ค. ํด๋น ์ปดํฌ๋ํธ์์ ๊ด๋ฆฌํ  state์ ์ข๋ฅ๊ฐ ๋๋ฌด ๋ง์ useReducer ํ์ ํตํด ์ํ๋ฅผ ๊ด๋ฆฌํฉ๋๋ค.

```jsx
const gameReducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "START_STAGE":
      const blockCount = Math.pow(Math.round((state.stage + 0.5) / 2) + 1, 2);
      const answerIndex = getRandomInteger(0, blockCount - 1);
      const { defaultColor, answerColor } = getRandomPairColor(state.stage);
      return {
        ...state,
        isPlaying: true,
        answer: answerIndex,
        time: action.time,
        defaultColor: defaultColor,
        answerColor: answerColor,
      };
    case "CLEAR_STAGE":
      return {
        ...state,
        stage: state.stage + 1,
        score: state.score + Math.pow(state.stage, 3) * state.time,
      };
    case "TIME_DECREASE":
      return { ...state, time: state.time < action.time ? 0 : state.time - action.time };
    case "RESET_GAME":
      return { ...initialState };
    case "GAME_OVER":
      return { ...state, isPlaying: false };
    default:
      throw new Error("Action type error");
  }
};
```

๋ฆฌ๋์์์๋ stage๋ฅผ ์์ํ๋ฉฐ ๊ธฐ๋ณธ์, ์ ๋ต์, ์ ๋ต๋ธ๋ก์ ์ธ๋ฑ์ค๋ฅผ ์ค์ ํ๋ START_STAGE๋ฅผ ํตํด ๊ฒ์์ ์คํํฉ๋๋ค. 
CLEAR_STAGE๋ ๊ฒ์์ ํด๋ฆฌ์ดํ๋ฉด ์คํํ๋ฉฐ stage๋ฅผ +1ํ๊ณ  ์ฑ๋ฆฐ์ง ๋ฌธ์์์ ์๊ตฌํ ๋ก์ง๋๋ก score๋ฅผ ๋ํด์ค๋๋ค.

TIME_DECREAE๋ ์๋ ฅํ ๊ฐ๋งํผ  time์ ๊ฐ์์ํค๋ฉฐ, ์ฑ๋ฆฐ์ง์์ ์์๋ก ๋ฐฐํฌํ ํ๋ก์ ํธ์ ๋์ผํ๊ฒ time๊ฐ์ 0๋ณด๋ค ์์์ง๊ฒฝ์ฐ 0์ผ๋ก ์ค์ ํฉ๋๋ค.

RESET_GAME์ initialState๋ก ๊ฒ์์ ์ด๊ธฐํ ํ๋ฉฐ, GAME_OVER๋ isPlaying ์ต์์ false๋ก ์์ ํฉ๋๋ค.

```jsx
	const blockRowCount = Math.round((stage + 0.5) / 2) + 1;
  const totalBlockCount = Math.pow(blockRowCount, 2);
  const blockSideLength = boardSide / blockRowCount - 4;

  const decreaseTime = (input: number) => {
    dispatch({ type: "TIME_DECREASE", time: input });
  };

  useEffect(() => {
    dispatch({ type: "START_STAGE", time: timePerStage });
  }, [stage]);

  useEffect(() => {
    const timer = setInterval(() => {
      if (isPlaying) decreaseTime(1);
    }, 1000);
    return () => clearInterval(timer);
  }, [isPlaying]);

  useEffect(() => {
    if (time === 0) {
      dispatch({ type: "GAME_OVER" });
      alert("GAME OVER!\n" + `์คํ์ด์ง: ${stage}, ์ ์: ${score} `);
      dispatch({ type: "RESET_GAME" });
      dispatch({ type: "START_STAGE", time: timePerStage });
    }
  }, [time]);

  const onSelect = (index: number) => {
    if (index === answer) {
      dispatch({ type: "CLEAR_STAGE" });
    } else decreaseTime(timePenalty);
  };
```

blockRowCount, totalBlockCount, blockSideLength๋ ๊ธฐ๋ณธ์ ์ธ stage๊ฐ๊ณผ props๋ก ๋ฐ๋ boardSide๋ก ๊ฐ์ ๊ตฌํ ์ ์์ด state๋ก ์ฌ์ฉํ๋๋์  ์ฝ๋๋ด const๊ฐ์ผ๋ก ์์ฑํ์ต๋๋ค.

useEffect๋ฅผ ํตํด ๋๋ถ๋ถ์ ๊ฒ์ ๋ก์ง์ด ๋์ํฉ๋๋ค .stage๊ฐ ๋ณํ ๋๋ง๋ค START_STAGE๋ฅผ dispathํด ์๋์ ์ผ๋ก ๊ฒ์์ด ํ๋ ์ด ๋๊ฒ ํ์ต๋๋ค. 
๊ทธ๋ฆฌ๊ณ  isPlaying state๋ฅผ ํตํด ๋งค 1์ด๋ง๋ค ์๊ฐ์ 1์ฉ ๊ฐ์ํ๊ฒํ์ผ๋ฉฐ, time๊ฐ์ด 0์ด ๋๋ ์๊ฐ gameover๊ฐ ๋๋ฉฐ, alert๋ก ํ์ฌ ์คํ์ด์ง์ ์ ์๋ฅผ ์ถ๋ ฅํฉ๋๋ค. ๊ทธํ alert์ฐฝ์์ ํ์ธ์ ๋๋ฅด๋ฉด ๊ฒ์์ ๋ฆฌ์ํ๊ณ  stage๋ฅผ ์ฌ์์ํฉ๋๋ค. 

onSelect๋ ๋ธ๋ก์ ์ ํํ๋ฉด ํด๋น ๋ธ๋ก์ ์ธ๋ฑ์ค์ answer์ ๊ฐ์ด ์ผ์นํ๋ฉด clear-stage๋ฅผ dispatchํฉ๋๋ค. 

๊ฐ์ด ๋ค๋ฅผ ๊ฒฝ์ฐ timePenalty๋งํผ ์๊ฐ์ ๊ฐ์์ํต๋๋ค.

```jsx
return (
    <>
      <Header stage={stage} time={time} score={score} />
      <div className={styles.wrapper}>
        {Array.from({ length: totalBlockCount }).map((_, index) => (
          <Block
            key={index}
            id={index}
            side={blockSideLength}
            color={index === answer ? answerColor : defaultColor}
            onSelect={onSelect}
          />
        ))}
      </div>
    </>
  );
```

```jsx
const Block: React.FC<BlockProps> = ({ side, id, color, onSelect }) => {
  return (
    <div
      onClick={() => onSelect(id)}
      style={{ width: side, height: side, backgroundColor: color, margin: 2 }}
    />
  );
};
```

๋จผ์  ๊ฒ์ํ ์๋จ์ ๊ฒ์์ ๋ณด๋ฅผ ํ์ํด์ฃผ๋ header ์ปดํฌ๋ํธ๋ฅผ ์ถ๊ฐํ์ต๋๋ค.
div tag ๋ด๋ถ์ ๋ธ๋ก์ ๋ ๋๋งํ๋ฉฐ totalBlockCount ๋งํผ array๋ฅผ ์์ฑํ map์ ํตํด ๋ธ๋ก์ ํฌ๊ธฐ์, color๋ฅผ ์ถ๊ฐํฉ๋๋ค. index๊ฐ answer์ ์ธ๋ฑ์ค์ ์ผ์นํ๋ฉด defaultColor ๋์  answerColor๋ฅผ ์ถ๊ฐํฉ๋๋ค. ๊ทธ๋ฆฌ๊ณ  onSelect ํจ์๋ฅผ ์ธ์๋ก ์ถ๊ฐํด ๋ธ๋ก์ ํด๋ฆญํ๋ฉด Block ์ปดํฌ๋ํธ์์ id ๊ฐ์ ์ธ์๋ก onSelect ํจ์๋ฅผ ์คํํด ํด๋ฆญํ ๋ธ๋ก์ ์ ๋ต์ฌ๋ถ๋ฅผ ์ฒดํฌํ์ฌ ์๊ฐ์ ๊น๊ฑฐ๋ ์คํ์ด์ง๋ฅผ ํด๋ฆฌ์ดํฉ๋๋ค.

## ๐ตย ์ด๋ ค์ ๋ ๋ถ๋ถ

```jsx
function getRandomInteger(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function plusOrMinus() {
  return Math.random() < 0.5 ? -1 : 1;
}

function getRandomPairColor(stage: number) {
  const baseRgb: number[] = Array.from({ length: 3 }, () => getRandomInteger(0, 255));
  const matchDiff = Math.round(stage / 3) + 0.2;
  const answerRgb: number[] = baseRgb.map((item) => {
    return item + plusOrMinus() * Math.floor(item / matchDiff);
  });
  const defaultColor: string = `rgb(${baseRgb[0]},${baseRgb[0]},${baseRgb[2]})`;
  const answerColor: string = `rgb(${answerRgb[0]},${answerRgb[0]},${answerRgb[2]})`;
  console.log(answerColor)
  return { defaultColor, answerColor };
}
```

lib ํด๋๋ด์์๋ answer์ ๊ฐ์ ์ ํ๊ธฐ์ํด ์ผ์ ๋ฒ์ ๋ด์ ๋ฌด์์ ์ ์๋ฅผ ๋ฆฌํดํ๋ getRandomInteger์ answerColor, defaultColor๋ฅผ ์์ฑํ๋ getRandomPairColor๊ฐ ์์ต๋๋ค.

```jsx
const blockRowCount = Math.round((stage + 0.5) / 2) + 1;
```

getRandomPairColor๋ฅผ ์์ฑํ ๋ ์คํ์ด์ง๋ณ ์๊น์ ์ด๋ค์์ผ๋ก ๋์ด๋๋ฅผ ๋์ผ๊น ๊ณ ๋ฏผ์ ๋ง์ด ํ์๋๋ฐ, FindDiffGame/index๋ด์ ์๋ ํ ๋ฉด๋น ๋ธ๋ก๊ฐ์๋ฅผ ๊ตฌํ๋ blockRowCount์ ์์ ์ฐธ๊ณ ํ์ต๋๋ค. 
๊ธฐ์กด rgb์ ๊ฐ๊ฐ์ ๊ฐ์ ์คํ์ด์ง๋ณ๋ก ์ ์  ์ฆ๊ฐํ๋ ๊ฐ์ ๋๋์ด ๋ฌด์์๋ก ๋ํ๊ฑฐ๋ ๋นผ๋ ๋ก์ง์ ํตํด answerColor๋ฅผ ์์ฑํฉ๋๋ค

## โย ๋ง์น๋ฉฐ

์ฒ์ ์ฑ๋ฆฐ์ง์ ๋์ ํ๋๋ฐ, ๊ฑฐ์ ๋ง๋ฐ์ง์ ์ ์ฒญํด ๊ธํ๊ฒ ์งํํ์ต๋๋ค.  ์ฝ๋์ ๊ตฌ์กฐ๋ state๊ฐ์ ์ค์ ํ๋ ๊ธฐ์ค์ ๋ํด ๊ณ ๋ฏผํด๋ณด๊ณ  ์ปดํฌ๋ํธ์ ๊ตฌ์ฑ์ ๊ณ ๋ฏผ์ ๊ณ์ํ๋ฉฐ ์์ฑํ์ต๋๋ค. ๋ด ๊ธฐ์ค์ผ๋ก๋ ์ต์ ์ ๋คํ๊ฒ ๊ฐ์ผ๋, ๋ด๊ฐ ๋์น๊ณ  ์๋ ์ ์ ๋นจ๋ฆฌ ์๊ณ  ๊ฐ์ ํ๊ณ  ์ถ์ ์๊ฐ์ด ๋ง์ด ๋๋ ์ฑ๋ฆฐ์ง ์์ต๋๋ค.

