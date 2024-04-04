import { createContext, useContext} from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";
// import { DeliveryAddressType } from "../types"

// type DeliveryContextProviderProps = {
//     children: ReactNode
// }



const DeliveryContext = createContext({})

export function useDelivery(){
    return useContext(DeliveryContext)
}

export function DeliveryProvider( { children } ){
    const [addressItems, setDeliveryItems] = useLocalStorage("delivery-info",[])
    const [currentAddress, setCurrentAddress] = useLocalStorage("current-address",[])

    function addDeliveryAddress(delivery){
        setDeliveryItems(delivery)
        setCurrentAddress(delivery)
      }

      function updateCurrentDeliveryAddress(delivery){
        setCurrentAddress(delivery)
      }

   
      function removeAddress(id){
        setDeliveryItems(currItems =>{
            return currItems.filter(item => item.id !== id)
        })
      }


    return (
        <DeliveryContext.Provider value={
            {
                addDeliveryAddress,
                removeAddress,
                addressItems,
                currentAddress
            }
        }>
            {children}
        </DeliveryContext.Provider>
    )
}