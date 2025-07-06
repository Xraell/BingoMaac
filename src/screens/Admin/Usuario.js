import { StyleSheet, Text, View } from 'react-native'
import { BingoColors } from '../../Theme/Colors'
import { useAppContext } from '../../context/AppProvider'
import { useEffect, useState } from 'react'
import FiltrarUsuarios from '../../components/Filtros/FiltrarUsuarios'
import TablaUsuarios from '../../components/Tablas/TablaUsuarios'
import ModalDetallesUsuario from '../../components/Modales/ModalDetallesUsuario'
import ModalAgregarCredito from '../../components/Modales/ModalAgregarCredito'
import ModalRetirarCredito from '../../components/Modales/ModalRetirarCredito'
export default function Usuario() {
  const {listUsers,user}= useAppContext()
  const [usuarioSeleccionado,setUsuarioSeleccionado]= useState(user)
  const [listaInternaUsuarios,setListaInternaUsuarios]= useState(listUsers)
  useEffect(() => {
    setListaInternaUsuarios(listUsers)
  }, [listUsers])
  const [visible, setVisible] = useState(false);
  const [visible2, setVisible2] = useState(false);
  const [visible3, setVisible3] = useState(false);
  
  return (
    <View style={{backgroundColor:BingoColors.black,flex:1}}>
    <View style={styles.bx}>
      <FiltrarUsuarios filtrar={setListaInternaUsuarios} ></FiltrarUsuarios>
      <TablaUsuarios listaFiltrada={listaInternaUsuarios} setUsuario={setUsuarioSeleccionado} abrirModal2={()=>setVisible2(true)} abrirModal={()=>setVisible(true)} abrirModal3={()=>setVisible3(true)}></TablaUsuarios>
    </View>
       <ModalDetallesUsuario usuario={usuarioSeleccionado} visible={visible} setVisible={setVisible}></ModalDetallesUsuario>
       <ModalAgregarCredito visible={visible2} setVisible={setVisible2} usuario={usuarioSeleccionado}></ModalAgregarCredito>
       <ModalRetirarCredito visible={visible3} setVisible={setVisible3} usuario={usuarioSeleccionado}></ModalRetirarCredito>
    </View>
  )
}
const styles = StyleSheet.create({
  bx:{
    flex:1,
    backgroundColor:BingoColors.background,
    borderTopRightRadius:30
  }
})