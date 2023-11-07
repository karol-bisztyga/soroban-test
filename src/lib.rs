#![no_std]

mod page_rank;
mod types;

use soroban_sdk::{contract, contractimpl, contracttype, Env, Map, String, Vec};
use page_rank::Rank;

#[derive(Clone)]
#[contracttype]
pub enum DataKey {
  TrustMap,
}

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

  pub fn get_trust_map(env: Env) -> Map<String, Map<String, ()>> {
    env
      .storage()
      .instance()
      .get(&DataKey::TrustMap)
      .unwrap_or(Map::new(&env))
  }

  pub fn set_trust_map(env: Env, trust_map: Map<String, Map<String, ()>>) {
    env.storage().instance().set(&DataKey::TrustMap, &trust_map);
  }

  pub fn clear_trust_map(env: Env) {
    env.storage().instance().set(
      &DataKey::TrustMap,
      &Map::<String, Map<String, ()>>::new(&env),
    );
  }

  pub fn set_trust_map_for_user_vec(
    env: Env,
    user_id: String,
    user_trust_map: Vec<String>,
  ) -> Map<String, ()> {
    let mut trust_map = HelloContract::get_trust_map(env.clone());

    let mut new_map = Map::new(&env);
    for item in user_trust_map {
      new_map.set(item, ());
    }

    trust_map.set(user_id.clone(), new_map);

    env.storage().instance().set(&DataKey::TrustMap, &trust_map);
    HelloContract::get_trust_map(env.clone())
      .get(user_id.clone())
      .unwrap_or(Map::new(&env))
  }

  pub fn calculate_page_rank(env: Env) -> Map<String, (u32, u32)> {
    let trust_map = HelloContract::get_trust_map(env.clone());

    let page_rank_result = match trust_map.len() {
      0 => Map::new(&env),
      _ => {
        let rank = Rank::from_pages(&env, trust_map);
        rank.calculate(&env)
      }
    };

    page_rank_result
  }

  pub fn calculate_page_rank_twice(env: Env) -> Map<String, (u32, u32)> {
    let trust_map = HelloContract::get_trust_map(env.clone());
    let len = trust_map.len();
    let page_rank_result = match len {
      0 => Map::new(&env),
      _ => {
        let rank = Rank::from_pages(&env, trust_map.clone() );
        rank.calculate(&env)
      }
    };
    let page_rank_result = match len {
      0 => Map::new(&env),
      _ => {
        let rank = Rank::from_pages(&env, trust_map);
        rank.calculate(&env)
      }
    };

    page_rank_result
  }
}

mod test;
