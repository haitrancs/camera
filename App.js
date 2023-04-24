import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Button } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import * as Permissions from 'expo-permissions';

const Camera = React.memo(({ scanned, handleBarCodeScanned }) => {
  return (
    <BarCodeScanner
      onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
      style={StyleSheet.absoluteFillObject}
    />
  );
});

export default function App() {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [barcodeData, setBarcodeData] = useState('');

  useEffect(() => {
    (async () => {
      const { status } = await Permissions.askAsync(Permissions.CAMERA);
      setHasPermission(status === 'granted');
    })();
  }, []);

  const validateID = (id) => {
    const regex = /^(1[7-9]|2[0-2])[0-9]{5}$/;
    return regex.test(id);
  }

  const handleBarCodeScanned = ({ type, data }) => {
    setScanned(true);

    if (!validateID(data)) {
      alert('Mã số sinh viên không hợp lệ!');
      return;
    }
    
    setBarcodeData(data);
    alert(`Barcode with type ${type} and data ${data} has been scanned!`);
  };

  if (hasPermission === null) {
    return <Text style={styles.text}>Requesting for camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text style={styles.text}>No access to camera</Text>;
  }

  return (
    <View style={styles.container}>
      <Camera scanned={scanned} handleBarCodeScanned={handleBarCodeScanned} />
      {scanned && (
        <Button
          title={'Tap to Scan Again'}
          onPress={() => setScanned(false)}
          style={styles.btn}
        />
      )}
      <Text style={styles.text}>Mã số sinh viên: {barcodeData}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000'
  },
  text: {
    position: 'absolute',
    top: 80,
    fontSize: 18,
    color: 'white',
    marginBottom: 10
  },
  btn: {
    backgroundColor: 'blue',
    borderRadius: 5,
    padding: 10,
    marginTop: 20
  }
});