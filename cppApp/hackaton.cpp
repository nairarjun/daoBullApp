#include <eosio/eosio.hpp>
#include <eosio/asset.hpp>
#include <eosio/system.hpp>
using namespace eosio;
using namespace std;

CONTRACT hackaton : public contract
{
public:
  using contract::contract;
  struct accounts
  {
    asset balance;
    uint64_t primary_key() const { return balance.symbol.code().raw(); }
  };
  typedef multi_index<name("accounts"), accounts> accounts_table;
  TABLE tokenprp
  {
    uint64_t id;
    uint64_t daoid;
    name creator;
    name user;
    asset amount;
    uint64_t yes;
    uint64_t no;
    vector<name> voted;
    time_point_sec created;
    time_point_sec expires;
    bool paid = false;
    auto primary_key() const { return id; };
  };
  typedef multi_index<name("tokenprp"), tokenprp> tokenprp_table;
  TABLE votingprp
  {
    uint64_t id;
    uint64_t daoid;
    name creator;
    string question;
    uint64_t yes;
    uint64_t no;
    vector<name> voted;
    time_point_sec created;
    time_point_sec expires;
    auto primary_key() const { return id; };
  };
  typedef multi_index<name("votingprp"), votingprp> votingprp_table;
  TABLE dao
  {
    uint64_t id;
    name creator;
    string daoname;
    uint32_t support;
    uint32_t minsupport;
    uint32_t minutesvote;
    asset token;
    asset eosvault;
    auto primary_key() const { return id; };
  };
  typedef multi_index<name("dao"), dao> dao_table;

  ACTION createdao(const name &creator, const string &daoname, const uint32_t &support, const uint32_t &minsupport, const uint64_t &minutesvote, const asset &token, const vector<name> &users, const vector<asset> &balances)
  {
    require_auth(creator);
    action(
        permission_level{name("daotokens123"), name("active")},
        name("daotokens123"),
        name("create"),
        make_tuple(get_self(), token))
        .send();
    action(
        permission_level{get_self(), name("active")},
        name("daotokens123"),
        name("issue"),
        make_tuple(get_self(), token, string("")))
        .send();
    for (uint32_t i = 0; i < balances.size(); i++)
    {
      action(
          permission_level{get_self(), name("active")},
          name("daotokens123"),
          name("transfer"),
          make_tuple(get_self(), users[i], balances[i], string("")))
          .send();
    }
    dao_table _dao(get_self(), get_self().value);
    _dao.emplace(creator, [&](auto &dao) {
      dao.id = _dao.available_primary_key();
      dao.creator = creator;
      dao.daoname = daoname;
      dao.support = support;
      dao.minsupport = minsupport;
      dao.minutesvote = minutesvote;
      dao.token = token;
    });
  }
  ACTION crtvotingprp(const uint64_t &daoid, const name &creator, string question)
  {
    require_auth(creator);
    votingprp_table _votingprp(get_self(), get_self().value);
    dao_table _dao(get_self(), get_self().value);
    auto dao_itr = _dao.find(daoid);
    time_point_sec created = current_time_point();
    time_point_sec expires = current_time_point() + minutes(dao_itr->minutesvote);
    _votingprp.emplace(creator, [&](auto &prp) {
      prp.id = _votingprp.available_primary_key();
      prp.daoid = daoid;
      prp.creator = creator;
      prp.question = question;
      prp.created = created;
      prp.expires = expires;
    });
  }
  ACTION crttokenprp(const uint64_t &daoid, const name &creator, const name &user, const asset &amount)
  {
    require_auth(creator);
    check(amount.amount > 0, "amount must be > 0");
    tokenprp_table _tokenprp(get_self(), get_self().value);
    dao_table _dao(get_self(), get_self().value);
    auto dao_itr = _dao.find(daoid);
    time_point_sec created = current_time_point();
    time_point_sec expires = current_time_point() + minutes(dao_itr->minutesvote);
    _tokenprp.emplace(creator, [&](auto &prp) {
      prp.id = _tokenprp.available_primary_key();
      prp.daoid = daoid;
      prp.creator = creator;
      prp.user = user;
      prp.amount = amount;
      prp.created = created;
      prp.expires = expires;
    });
  }
  ACTION votevotprp(const uint64_t &id, const name &voter, const asset &tkn, const bool &choice)
  {
    require_auth(voter);
    asset balance = gettknbln(voter, tkn);
    check(balance.amount > 0, "zero balance");
    votingprp_table _votingprp(get_self(), get_self().value);
    auto itr = _votingprp.find(id);
    check(itr->expires > current_time_point(), "proposal expired");
    for (uint64_t i = 0; i < itr->voted.size(); i++)
    {
      check(itr->voted[i] != voter, "you already voted");
    }
    _votingprp.modify(itr, voter, [&](auto &prp) {
      prp.voted.push_back(voter);
      if (choice)
      {
        prp.yes += balance.amount;
      }
      else
      {
        prp.no += balance.amount;
      }
    });
  }
  ACTION votetknprp(const uint64_t &id, const name &voter, const asset &tkn, const bool &choice)
  {
    require_auth(voter);
    asset balance = gettknbln(voter, tkn);
    check(balance.amount > 0, "zero balance");
    tokenprp_table _tokenprp(get_self(), get_self().value);
    auto itr = _tokenprp.find(id);
    check(itr->expires > current_time_point(), "proposal expired");
    for (uint64_t i = 0; i < itr->voted.size(); i++)
    {
      check(itr->voted[i] != voter, "you already voted");
    }
    _tokenprp.modify(itr, voter, [&](auto &prp) {
      prp.voted.push_back(voter);
      if (choice)
      {
        prp.yes += balance.amount;
      }
      else
      {
        prp.no += balance.amount;
      }
    });
  }
  ACTION exectknprp(const uint64_t id)
  {
    tokenprp_table _tokenprp(get_self(), get_self().value);
    auto itr = _tokenprp.find(id);
    check(itr->expires < current_time_point(), "proposal still running");
    check(itr->paid == false, "already paid");
    if (itr->yes > itr->no)
    {
      _tokenprp.modify(itr, same_payer, [&](auto &prp) {
        prp.paid = true;
      });
      action(
          permission_level{get_self(), name("active")},
          name("daotokens123"),
          name("transfer"),
          make_tuple(get_self(), itr->user, itr->amount, string("")))
          .send();
    }
  }
  // [[eosio::on_notify("eosio.token::transfer")]] void deposit(name from, name to, asset quantity, string memo)
  // {
  //   if (to != get_self() || from == get_self())
  //   {
  //     return;
  //   }
  //   check(quantity.amount > 0, "Amount must be greather than 0");
  //   check(quantity.symbol == symbol("EOS", 4), "Wrong token");
  //   uint64_t id = stoi(memo);
  //   dao_table _dao(get_self(), get_self().value);
  //   auto itr = _dao.find(id);
  //   _dao.modify(itr, same_payer, [&](auto &d) {
  //     d.vault += quantity;
  //   })
  // }
  ACTION erasedao(const uint64_t id)
  {
    dao_table _dao(get_self(), get_self().value);
    auto itr = _dao.find(id);
    _dao.erase(itr);
  }
  ACTION erasevotprp(const uint64_t id)
  {
    votingprp_table _votingprp(get_self(), get_self().value);
    auto itr = _votingprp.find(id);
    _votingprp.erase(itr);
  }
  ACTION erasetknprp(const uint64_t id)
  {
    tokenprp_table _tokenprp(get_self(), get_self().value);
    auto itr = _tokenprp.find(id);
    _tokenprp.erase(itr);
  }
  asset gettknbln(const name &voter, const asset &tkn)
  {
    accounts_table tmp(name("daotokens123"), voter.value);
    symbol TOKEN_SYMBOL = tkn.symbol;
    auto itr = tmp.find(TOKEN_SYMBOL.code().raw());
    check(itr != tmp.end(), "The token doesn't exist in the token contract, or the account doesn't own any of these tokens");
    asset balance = itr->balance;
    return balance;
  }
};