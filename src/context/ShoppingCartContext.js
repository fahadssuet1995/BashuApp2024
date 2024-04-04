import { createContext, useContext} from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";




const ShoppingCartContext = createContext({})

export function useShoppingCart(){
    return useContext(ShoppingCartContext)
}

export function ShoppingCartProvider( { children } ){
    const [cartItems, setCartItems] = useLocalStorage("shopping-cart",[])

    function getItemQuantity(id){
        return cartItems.find(item => item.id === id)?.quantity || 0
    }

    function increaseCartQuantity(id, product){
      setCartItems( currItems =>{
            if(currItems.find(item=>item.id === id) == null){
                return [...currItems, {id, quantity: 1, name :product.name, image: "sd", description: "we", price:product.price }]
            }else{
               return currItems.map(item=>{
                    if(item.id === id){
                       return { ...item, quantity: item.quantity + 1} 
                    } else{
                       return item
                    }
                })
            }
      })
    }

    function decreaseCartQuantity(id){
        setCartItems( currItems =>{
              if(currItems.find(item=>item.id === id)?.quantity === 1){
                  return currItems.filter(item => item.id !== id)
              }else{
                 return currItems.map(item=>{
                      if(item.id === id){
                         return { ...item, quantity: item.quantity - 1} 
                      } else{
                         return item
                      }
                  })
              }
        })
      }

      function removeFromCart(id){
        setCartItems(currItems =>{
            return currItems.filter(item => item.id !== id)
        })
      }

      const cartQuantity = cartItems.reduce(
        (quantity, item) => item.quantity + quantity , 0
      )

   

    return (
        <ShoppingCartContext.Provider value={
            {
                getItemQuantity,
                increaseCartQuantity,
                decreaseCartQuantity, 
                removeFromCart,
                cartItems,
                cartQuantity
            }
        }>
            {children}
        </ShoppingCartContext.Provider>
    )
}