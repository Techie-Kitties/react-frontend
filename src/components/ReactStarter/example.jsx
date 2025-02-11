//React files are written as JSX, which is an extension of javascript.
//This effectively allows us to mix our HTML into our JS.
//The tech stack for this project also utilizes TailwindCSS, which allows us to inline our CSS directly into
//the classnames of our elements. you can find a list of Tailwind shorthand here: https://tailwindcss.com/docs/flex
//When working with a component based system, we must be wary of "Margin collapse" which occurs when two different components
//have conflicting margins and end up in places that are not intended, for example when a margin-top and margin-bottom components touch
// the larger margin alone will be used, we can remedy this using padding alone or space-x/space-y tailwind classes
//React allows us to make realtime state changes very easily. below is an included template as well as a short
//explaination of most relevant hooks.

import React, { useState, useEffect, useMemo } from "react";
//We still need to import react and the hooks used
//There are other hooks that can be used, but these are the most relevant.

//each react component is exported as a function, where we return any valid JSX.
export function Example() {
  //React components may only have one parent element. So to return multiple DOM elements we must use whats called a "fragment"
  // We can either use React.Fragment() and include our jsx as a paraemeter of this, or use empty HTML tags to fragment it.
  // or wrap it in a parent div (not suggested, use as a last resort)

  //the first of the relevant hooks, useState(), effectively getters and setters from OOP.
  //if we wish to increment a count we can setCount(count+1) and to retrive it we may access count
  const [count, setCount] = useState(0);
  const [isEven, setIsEven] = useState(false);
  //if not importing the individual components as above, we may use as React.useState()

  //useEffect is a "listener" for lack of a better word which triggers **AFTER** every render, the syntax is as follows
  useEffect(
    () => {
      count % 2 == 0 ? setIsEven(true) : setIsEven(false);
      //this is a ternery operator, it is effectively a one-line if statement here
    },
    [count]
    /*the variable in the "array" is what condition is being listened for
    this is very useful to handle state changes, as we can modify elements in the useEffect
    if nothing is included in the "array", every render will trigger the function.*/
  );

  //useMemo caches a varibale, this is useful for anything that would be expensive to calculate/retrive
  //for instance, getting the closest fibbonaci sequence number based on count
  const closestFibonacci = useMemo(() => {
    return getClosestFibonacciNumbers(count);
  }, [count]);

  return (
    <>
      {/*"without these braces here, the component will throw an error"*/}
      <div className="flex  space-y-1.5 flex-col items-center justify-center h-screen bg-black text-white">
        <div className="">Count is currently {isEven ? "even" : "odd"}</div>
        <div className="">Count is currently {count}</div>
        <div className="">
          Fibonacci Numbers: {closestFibonacci.prevFib} ,{" "}
          {closestFibonacci.nextFib}
        </div>
        <button
          className="w-16 h-8 rounded-xl bg-blue-700"
          onClick={() => setCount(count + 1)}
        >
          Click me
        </button>
      </div>
    </>
  );
}
//fibonacci sequence generator
function getClosestFibonacciNumbers(n) {
  if (n < 0) return { prevFib: 0, nextFib: 1 };

  let a = 0,
    b = 1;
  while (b < n) {
    let temp = b;
    b = a + b;
    a = temp;
  }

  return { prevFib: a, nextFib: b };
}
