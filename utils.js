export const fetchAmountOut = async (tokenInAddr,tokenOutAddr,amountIn)=>{
    try {
        const response = await fetch(`https://aggregator-api.kyberswap.com/polygon/api/v1/routes?tokenIn=${tokenInAddr}&tokenOut=${tokenOutAddr}&amountIn=${amountIn}`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.log(error);
    }
}