import { Api, JsonRpc } from 'eosjs' // https://github.com/EOSIO/eosjs
import { JsSignatureProvider } from 'eosjs/dist/eosjs-jssig'
import config from '../common/config'

export default class EOSIOClient {
  constructor(contractAccount, activeUser) {
    const rpc = new JsonRpc(config.REACT_APP_EOSIO_HTTP_URL)
    this.contractAccount = contractAccount
    this.eos = activeUser
    this.rpc = new JsonRpc(config.REACT_APP_EOSIO_HTTP_URL)
  }


  transaction = async (actor, action, data) => {
    console.log("transaction.....!!!!!!", "actor:", actor, "action:", action, "data:", data)
    try {
      let tansact = await this.eos.signTransaction({
        actions: [
          {
            account: this.contractAccount,
            name: action,
            authorization: [
              {
                actor,
                permission: 'active'
              }
            ],
            data: {
              ...data
            }
          }
        ]
      }, { broadcast: true })
      return tansact

    } catch (error) {
      alert(error)
      return { isError: true }

    }

  }

  getTableScope = async (contract, table, scope) => {
    return await this.rpc.get_table_by_scope({
      json: true,
      "code": contract,
      "table": table,
      "scope": scope,
      "reverse": true,
      "show_payer": true
    })
  }

  getTableRows = async (contract, scope, table, lower = null, upper = null, pageSize = null) => {
    console.log("scope....getTableRowsCALLER", contract, scope, table, lower, upper, pageSize)
    let req = {
      json: true,
      code: contract, //contract that we target
      scope: scope, //account that owns data  
      table: table,//table name
      // limit: pageSize,
      // lower_bound: 0,
      // upper_bound: 30,
      // lower_bound:'id',//table primary key
      // limit:20,//here we limit to 1 get only the single row with primary key eqaul to testacc
      reverse: false,
      show_payer: true
    }
    if (pageSize != null)
      req.limit = pageSize
    let data = await this.rpc.get_table_rows(req)
    console.log()
    console.log({ scope, data })
    return { scope, data }
  }
}
