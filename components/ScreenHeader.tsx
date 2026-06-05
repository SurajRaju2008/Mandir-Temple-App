import { Link } from 'expo-router';
import { Pressable, StyleSheet, View as RNView } from 'react-native';
import { SymbolView } from 'expo-symbols';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Text } from '@/components/Themed';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';

type ScreenHeaderProps = {
  title: string;
  showNotifications?: boolean;
  rightAction?: React.ReactNode;
};

export function ScreenHeader({ title, showNotifications = false, rightAction }: ScreenHeaderProps) {
  const insets = useSafeAreaInsets();
  const scheme = useColorScheme();
  const colors = Colors[scheme ?? 'light'];

  return (
    <RNView style={[styles.header, { paddingTop: insets.top + 8, backgroundColor: colors.tint }]}>
      <Text style={styles.title}>{title}</Text>
      <RNView style={styles.actions}>
        {rightAction}
        {showNotifications && (
          <Link href="/notifications" asChild>
            <Pressable style={styles.iconButton}>
              <SymbolView
                name={{ ios: 'bell.fill', android: 'notifications', web: 'notifications' }}
                size={22}
                tintColor="#fff"
              />
            </Pressable>
          </Link>
        )}
      </RNView>
    </RNView>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#fff',
    flex: 1,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconButton: {
    padding: 6,
  },
});
