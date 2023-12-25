import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, TextInput, ScrollView,StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { fetchAmountOut } from './utils';

const App = () => { 
  const [tradeType, setTradeType] = useState('buy');
  const [orderType, setOrderType] = useState('market');
  const [selectedDropDownValue, setSelectedDropDownValue] = useState('Spot');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [value, setValue] = useState('1');
  const [convertedValue, setConvertedValue] = useState('token');
  const [commingSoon, setCommingSoon] = useState(false);
  const [slipageValue, setSlipageValue] = useState(1);
  const [tokenOut, setTokenOut] = useState(0);
  const [gasUsd, setGasUsd] = useState(0);
  const [entryPrice, setEntryPrice] = useState(0);

  const handleInputChange = (text) => {
    const numericValue = text.replace(/[^0-9]/g, '');

    let formattedValue;
    if(tradeType==='buy'){
       formattedValue = `${numericValue}`;
    }
    else{
      formattedValue = `${numericValue}`;
    }

    setValue(formattedValue);
  };

  useEffect(() => {
    if (selectedDropDownValue === 'Margin' || selectedDropDownValue === 'Algo' || orderType === 'limit' || orderType === 'stop') {
      setCommingSoon(true);
    } else {
      setCommingSoon(false);
    }
  }, [selectedDropDownValue, orderType]);

  // useEffect(() => {
  //   handleInputChange(1);
  // }, [tradeType]);

  useEffect(() => {
    const numericValue = Number(value.replace(/[^0-9.]/g, ''));
    const getAmountOut = async()=>{
      let res;
      if(tradeType==='buy'){
         res = await fetchAmountOut('0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174','0x1BFD67037B42Cf73acF2047067bd4F2C47D9BfD6',numericValue*10**6);
         setTokenOut((res.data.routeSummary.amountOut)/10**8);
      }
      else{
        res = await fetchAmountOut('0x1BFD67037B42Cf73acF2047067bd4F2C47D9BfD6','0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',numericValue*10**8);
        setTokenOut(res.data.routeSummary.amountOutUsd);

      }
      console.log(res)
      setEntryPrice(res.data.routeSummary.amountOutUsd)
      setGasUsd(res.data.routeSummary.gasUsd)
    }
    if(numericValue>0){
      getAmountOut();
    }
    if(numericValue==0){
      setTokenOut(0);
    }
  }, [value,tradeType])
  

  return (
    <ScrollView style={{ backgroundColor: '#0E0E0E', padding: 14, paddingTop: 34, color: 'white', fontFamily: 'sans-serif' }}>
      <View style={{ display:'flex',justifyContent: 'space-between',alignItems: 'center',flexDirection:'row',marginBottom:20 }}>
          <Text style={{color:'#fff',fontWeight:'bold',fontSize:28}}>Trade</Text>
        {commingSoon ? null : (
            <Picker
              style={styles.picker}
              selectedValue={selectedDropDownValue}
              onValueChange={(itemValue, itemIndex) =>
                setSelectedDropDownValue(itemValue)
              }>
            <Picker.Item label="Spot" value="Spot" />
            <Picker.Item label="Margin" value="Margin" />
            <Picker.Item label="Algo" value="Algo" />
          </Picker>
        )}
      </View>
      {commingSoon ? (
        <View style={{ height: '80%', alignItems: 'center', justifyContent: 'center' }}>
          <Image source={selectedDropDownValue === 'Margin' ? require('./assets/leverage.png') : selectedDropDownValue === 'Algo' ? require('./assets/algo.png') : orderType === 'limit' ? require('./assets/limit.png') : require('./assets/stop.png')} style={{ width: 300, height: 300 }} />
          <Text style={{ fontSize: 22, fontWeight: 'bold', textAlign: 'center',color:'#fff' }}>Coming Soon</Text>
        </View>
      ) : (
        <>
          {/* Buy/Sell */}
          <View style={{ flexDirection: 'row', height: 44, borderRadius: 100, backgroundColor: '#151515', alignItems: 'center', justifyContent: 'space-between', padding: 4,marginBottom:10 }}>
            <TouchableOpacity onPress={() => { setTradeType('buy'); setValue('1'); setConvertedValue('token'); }}>
              <Text style={tradeType === 'buy' ? { padding: 10, fontWeight: 'bold', backgroundColor: '#6EE7B7', borderRadius: 100, color: '#171717' } : { color: '#848484', fontWeight: 'bold', padding: 10 }}>Buy</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => {setTradeType('sell');setValue('1')}}>
              <Text style={tradeType === 'sell' ? { padding: 10, fontWeight: 'bold', backgroundColor: '#6EE7B7', borderRadius: 100, color: '#171717' } : { color: '#848484', fontWeight: 'bold', padding: 10 }}>Sell</Text>
            </TouchableOpacity>
          </View>

          {/* Market, Limit, Stop */}
          <View style={{ flexDirection: 'row', height: 44, borderRadius: 100, backgroundColor: '#151515', alignItems: 'center', justifyContent: 'space-between', padding: 4 }}>
            <TouchableOpacity onPress={() => setOrderType('market')}>
              <Text style={orderType === 'market' ? { padding: 10, fontWeight: 'bold', backgroundColor: '#6EE7B7', borderRadius: 100, color: '#171717' } : { color: '#848484', fontWeight: 'bold', padding: 10 }}>Market</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setOrderType('limit')}>
              <Text style={orderType === 'limit' ? { padding: 10, fontWeight: 'bold', backgroundColor: '#6EE7B7', borderRadius: 100, color: '#171717' } : { color: '#848484', fontWeight: 'bold', padding: 10 }}>Limit</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setOrderType('stop')}>
              <Text style={orderType === 'stop' ? { padding: 10, fontWeight: 'bold', backgroundColor: '#6EE7B7', borderRadius: 100, color: '#171717' } : { color: '#848484', fontWeight: 'bold', padding: 10 }}>Stop</Text>
            </TouchableOpacity>
          </View>

          {/* How much? */}
          <View style={{ marginTop: 45, alignItems: 'center' }}>
            <Text style={{ color: '#7E7E7E', fontSize: 16 }}>How much would you like to invest?</Text>
            <View style={{ marginTop: 48, flexDirection: 'row',alignItems:'center',justifyContent:'center',  transform: [{ translateX: 100 }] }}>
              <Text style={{fontWeight:'bold',color:'#fff',fontSize: 48}}>{tradeType === 'buy' ? '$':'₿'}</Text>
              <TextInput
                style={{ width:'50%', backgroundColor: 'transparent', color: '#ffffff',fontWeight:'600',fontSize: 48, textAlign: 'left',borderWidth:0}}
                keyboardType="numeric"
                value={value}
                onChangeText={handleInputChange}    
                />
            </View>
            <View style={{ marginTop: 24 }}>
              <View>
                {convertedValue === 'token' ? (
                  <Text style={{ color: '#fff', fontWeight: 'bold', marginLeft: 4 }}> You'll get : {tokenOut} {tradeType==='buy'?'BTC':'USD'}</Text>
                ) : (
                  <Text style={{ color: '#fff', fontWeight: 'bold', marginLeft: 4 }}>0.00</Text>
                )}
              </View>
            </View>
          </View>


    <View>
      {/* Accordion Header */}
      <TouchableOpacity
        style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 10, backgroundColor: '#333', marginVertical: 10,borderRadius:10 }}
        onPress={() => setIsModalOpen(!isModalOpen)}
      >
        <Text style={{ color: '#fff', fontWeight: 'bold' }}>Order Summary</Text>
        <Image
          source={isModalOpen===true ? require('./assets/upA.png') : require('./assets/downA.png')}
          style={{ width: 20, height: 20 }}
        />
      </TouchableOpacity>

      {/* Accordion Content */}
      {isModalOpen && (
        <View style={{ backgroundColor: '#444', padding: 10 }}>
          <Text style={{ color: '#fff' }}>Entry Price: ${entryPrice}</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={{ color: '#fff' }}>Slippage: </Text>
            <TextInput
              style={{ borderWidth:1,borderColor:'#fff',borderRadius:10, color: '#fff', padding:4, width: 50,marginVertical:10,marginRight:5 }}
              value={slipageValue}
              onChangeText={(text) => setSlipageValue(text)}
            />
            <Text style={{ color: '#fff' }}>%</Text>
          </View>
          <Text style={{ color: '#fff' }}>Estimated Fee: ${gasUsd}</Text>
        </View>
      )}
    </View>
            <TouchableOpacity style={{flex:1,justifyContent:'center',alignItems:'center'}}>
              <View style={{ marginTop: 30, width:200, height: 44, borderRadius: 100, backgroundColor: '#6EE7B7',color:'#171717', alignItems: 'center', justifyContent: 'center', marginHorizontal: "auto" }}>
                  <Text style={{ color:'#171717', fontWeight: 'bold', fontSize: 16 }}>Confirm Order</Text>
              </View>
            </TouchableOpacity>
        </>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  picker: {
    width: 120,
    height: 30,
    backgroundColor:'#171717',
    color:'#fff',
    borderRadius: 8,
    fontWeight: 'bold',
    outline:'none',
  },
});

export default App;
