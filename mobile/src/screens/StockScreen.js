import { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { getProducts, adjustStock } from '../services/api';

// Color según el nivel de stock respecto al mínimo (mismo criterio que la web).
function stockColor(p) {
  if (p.stock <= p.min) return '#c0392b';
  if (p.stock <= p.min * 1.5) return '#e67e22';
  return '#27ae60';
}

export default function StockScreen({ navigation }) {
  const { token, user, logout } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setError('');
    try {
      const data = await getProducts(token);
      setProducts(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [token]);

  useEffect(() => {
    load();
  }, [load]);

  const onRefresh = () => {
    setRefreshing(true);
    load();
  };

  const handleLogout = () => {
    logout();
    navigation.replace('Login');
  };

  // Ajusta el stock de un producto y actualiza la lista con el dato que devuelve la API.
  const handleAdjust = async (product, delta) => {
    try {
      const updated = await adjustStock(token, product.id, delta);
      setProducts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
    } catch (e) {
      setError(e.message);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#0a1f44" />
        <Text style={styles.loadingText}>Cargando stock…</Text>
      </View>
    );
  }

  // KPIs calculados a partir de la lista.
  const totalUnits = products.reduce((sum, p) => sum + p.stock, 0);
  const lowStock = products.filter((p) => p.stock <= p.min).length;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Inventario</Text>
          <Text style={styles.headerSub}>{user?.name}</Text>
        </View>
        <TouchableOpacity onPress={handleLogout}>
          <Text style={styles.logout}>Salir</Text>
        </TouchableOpacity>
      </View>

      {/* KPIs */}
      <View style={styles.kpiRow}>
        <View style={styles.kpiBox}>
          <Text style={styles.kpiValue}>{products.length}</Text>
          <Text style={styles.kpiLabel}>Productos</Text>
        </View>
        <View style={styles.kpiBox}>
          <Text style={styles.kpiValue}>{totalUnits}</Text>
          <Text style={styles.kpiLabel}>Unidades</Text>
        </View>
        <View style={styles.kpiBox}>
          <Text style={[styles.kpiValue, lowStock ? { color: '#c0392b' } : null]}>
            {lowStock}
          </Text>
          <Text style={styles.kpiLabel}>Bajo mín.</Text>
        </View>
      </View>

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <FlatList
        data={products}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={{ padding: 16 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardTop}>
              <View style={{ flex: 1 }}>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.category}>
                  {item.category} · mín {item.min}
                </Text>
              </View>
              <View style={styles.stockBox}>
                <Text style={[styles.stock, { color: stockColor(item) }]}>{item.stock}</Text>
                <Text style={styles.unit}>uds</Text>
              </View>
            </View>

            {/* Botones de ajuste de stock */}
            <View style={styles.adjustRow}>
              <TouchableOpacity
                style={[styles.adjBtn, styles.adjMinus]}
                onPress={() => handleAdjust(item, -10)}
              >
                <Text style={styles.adjText}>−10</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.adjBtn, styles.adjMinus]}
                onPress={() => handleAdjust(item, -1)}
              >
                <Text style={styles.adjText}>−1</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.adjBtn, styles.adjPlus]}
                onPress={() => handleAdjust(item, +1)}
              >
                <Text style={styles.adjText}>+1</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.adjBtn, styles.adjPlus]}
                onPress={() => handleAdjust(item, +10)}
              >
                <Text style={styles.adjText}>+10</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f6f8' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { marginTop: 12, color: '#666' },
  header: {
    backgroundColor: '#0a1f44',
    paddingTop: 50,
    paddingBottom: 16,
    paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  headerTitle: { color: '#fff', fontSize: 22, fontWeight: 'bold' },
  headerSub: { color: '#c8a951', fontSize: 13 },
  logout: { color: '#fff', fontSize: 14, textDecorationLine: 'underline' },
  kpiRow: {
    flexDirection: 'row',
    backgroundColor: '#0a1f44',
    paddingBottom: 16,
    paddingHorizontal: 16,
  },
  kpiBox: {
    flex: 1,
    backgroundColor: '#13294f',
    borderRadius: 8,
    paddingVertical: 10,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  kpiValue: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
  kpiLabel: { color: '#9fb0cc', fontSize: 11, marginTop: 2 },
  error: { color: '#c0392b', textAlign: 'center', padding: 12 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 16,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  cardTop: { flexDirection: 'row', alignItems: 'center' },
  name: { fontSize: 16, fontWeight: '600', color: '#222' },
  category: { fontSize: 13, color: '#888', marginTop: 2 },
  stockBox: { alignItems: 'center', minWidth: 60 },
  stock: { fontSize: 22, fontWeight: 'bold' },
  unit: { fontSize: 11, color: '#999' },
  adjustRow: {
    flexDirection: 'row',
    marginTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 12,
    justifyContent: 'space-between',
  },
  adjBtn: {
    flex: 1,
    marginHorizontal: 3,
    paddingVertical: 8,
    borderRadius: 6,
    alignItems: 'center',
    borderWidth: 1,
  },
  adjMinus: { borderColor: '#c0392b' },
  adjPlus: { borderColor: '#27ae60' },
  adjText: { fontSize: 14, fontWeight: '600', color: '#333' },
});
