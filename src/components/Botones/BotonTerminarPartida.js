import { StyleSheet, Text, View } from 'react-native'
import { IconButton } from 'react-native-paper'
import { BingoColors } from '../../Theme/Colors'
export default function BotonTerminarPartida({volver}) {
  return (
    <IconButton iconColor={BingoColors.white} onPress={()=>volver()} icon={'exit-to-app'} size={25} mode='contained'  style={styles.icon}></IconButton>
  )
}
const styles = StyleSheet.create({
  icon:{
    backgroundColor:BingoColors.primary,
    color:BingoColors.white,
    position:'absolute',
    right:10,
    top:-20
  }
})