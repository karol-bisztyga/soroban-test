#![no_std]
#![allow(non_upper_case_globals)]

use soroban_sdk::{Env, String, symbol_short, Symbol, contract, contractimpl};

type DataType = soroban_sdk::String;

const DATA: Symbol = symbol_short!("DATA");

#[contract]
pub struct MyContract;

#[contractimpl]
impl MyContract {
  pub fn get_val(env: Env) -> String {
    env
      .storage()
      .instance()
      .get(&DATA)
      .unwrap_or(String::from_slice(&env, "NONE"))
  }

  pub fn set_val(env: Env, new_val: String) {
    env
      .storage()
      .instance()
      .set(&DATA, &new_val);
  }
  // use external type - if u comment below, it will work
  pub fn get_val_ext_type(env: Env) -> DataType {
    env
      .storage()
      .instance()
      .get(&DATA)
      .unwrap_or(String::from_slice(&env, "NONE"))
  }

  pub fn set_val_ext_type(env: Env, new_val: DataType) {
    env
      .storage()
      .instance()
      .set(&DATA, &new_val);
  }
}

#[cfg(test)]
mod tests;
