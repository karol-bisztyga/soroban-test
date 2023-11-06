#![no_std]
use soroban_sdk::{contract, contractimpl, Env};

#[contract]
pub struct HelloContract;

#[contractimpl]
impl HelloContract {
  pub fn add(_env: Env, a: u32, b: u32) -> u32 {
    a + b
  }
}

mod test;
