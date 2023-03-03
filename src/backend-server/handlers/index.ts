import SharedHandlers from '../../shared/handlers'
import Transfers from './transfers'
import Parties from './parties'

export default {
  HealthGet: SharedHandlers.HealthGet,
  PartiesByTypeAndID: Parties.PartiesByTypeAndID,
  PostTransfers: Transfers.PostTransfers
}
