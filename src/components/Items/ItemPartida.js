import { StyleSheet, Text, View } from 'react-native'
import { BingoColors } from '../../Theme/Colors'
export default function ItemPartida({parttida}) {
  return (
    <View style={styles.bx}>
      <Text>ItemPartida</Text>
    </View>
  )
}
const styles = StyleSheet.create({
    bx:{
        backgroundColor:BingoColors.white,
        marginHorizontal:15,
        marginVertical:8,
        padding:10,
        borderRadius:5
    }
})