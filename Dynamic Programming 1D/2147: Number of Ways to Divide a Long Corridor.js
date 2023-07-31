// https://leetcode.com/problems/number-of-ways-to-divide-a-long-corridor/description/
// Difficulty: hard
// Tags: dynamic programming 1d

// Problem
/*
Along a long library corridor, there is a line of seats and decorative plants. You are given a 0-indexed string corridor of length n consisting of letters 'S' and 'P' where each 'S' represents a seat and each 'P' represents a plant.

One room divider has already been installed to the left of index 0, and another to the right of index n - 1. Additional room dividers can be installed. For each position between indices i - 1 and i (1 <= i <= n - 1), at most one divider can be installed.

Divide the corridor into non-overlapping sections, where each section has exactly two seats with any number of plants. There may be multiple ways to perform the division. Two ways are different if there is a position with a room divider installed in the first way but not in the second way.

Return the number of ways to divide the corridor. Since the answer may be very large, return it modulo 109 + 7. If there is no way, return 0.
*/

// Solution, time: unclear, space O(n)
/*
For each problem, we can add a divider anywhere after 2 seats, but before a 3rd. The base case is when there are only two seats left. Don't forget the edge case of no seats or exactly 2 seats.

It's not entirely clear to me what the time complexity of this problem is. We have n states, and for each state we check up to n future cells, but I also feel like there is some amortization going on, because if we check up to n future cells it implies there aren't seats there meaning fewer subproblems.
*/

const MOD = 10 ** 9 + 7;

var numberOfWays = function (corridor) {
  // possibly take out any edge cases where it isn't valid / just prune speed of alg
  let totalSeats = 0;
  for (const char of corridor) {
    if (char === "S") {
      totalSeats++;
    }
  }
  if (totalSeats % 2 === 1) {
    return 0;
  }
  if (totalSeats === 0) {
    return 0;
  }
  if (totalSeats === 2) {
    return 1;
  }

  let endingIndex; // imagine we have two seats left in our last area, with some amount of plants on the left / inbetween / on the right of the seats, this is our base case, when we have nothing left to split, so I determine the index 1 to the right of the 3rd to last seat, to know when to trigger the base case
  let seatsSeen = 0;
  for (let i = corridor.length - 1; i >= 0; i--) {
    if (corridor[i] === "S") {
      seatsSeen++;
      if (seatsSeen === 3) {
        endingIndex = i + 1;
        break;
      }
    }
  }

  // memo[l] is the answer to the subproblem [l:]
  const memo = new Array(corridor.length).fill(-1);

  function dp(l) {
    // base case
    if (l >= endingIndex) {
      return 1;
    }

    if (memo[l] !== -1) {
      return memo[l];
    }

    // find the index of the 2nd seat from the left in [l:], and the index of the third
    let indexOfSecond;
    let indexOfThird;
    let seatsSeen = 0;
    for (let i = l; i < corridor.length; i++) {
      if (corridor[i] === "S") {
        seatsSeen++;
        if (seatsSeen === 2) {
          indexOfSecond = i;
        } else if (seatsSeen === 3) {
          indexOfThird = i;
          break;
        }
      }
    }

    // we can put a divider at any point, right after the second seat, until the next seat comes up

    let resultForThis = 0;
    for (let i = indexOfSecond; i < indexOfThird; i++) {
      // we put a divider on the right of this index, then are left with the remaining region subproblem
      const ifDividerHere = dp(i + 1);
      resultForThis += ifDividerHere;
    }

    memo[l] = resultForThis % MOD;
    return resultForThis % MOD;
  }

  return dp(0);
};
