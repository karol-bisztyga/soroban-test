#![no_std]
use soroban_sdk::{contract, contractimpl, Env, Map, String};

#[contract]
pub struct HelloContract;

#[contractimpl]
impl HelloContract {
  pub fn add(_env: Env, a: u32, b: u32) -> u32 {
    a + b
  }

  pub fn sum_map(_env: Env, map: Map<String, u32>) -> u32 {
    let mut result = 0;
    for (_name, value) in map {
      result += value;
    }
    result
  }
}

mod test;
