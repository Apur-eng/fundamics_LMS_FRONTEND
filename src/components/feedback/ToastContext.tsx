import React, { createContext, useContext, useState, useCallback, ReactNode, useRef } from 'react';
import {
  Animated,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../theme';
import { Text } from '../common/Text';

export type ToastType = 'success' | 'danger' | 'warning' | 'info';

export interface ToastOptions {
  message: string;
  type?: ToastType;
  duration?: number;
  actionLabel?: string;
  onAction?: () => void;
}

interface ToastContextType {
  showToast: (options: ToastOptions | string) => void;
  hideToast: () => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { colors, spacing, borderRadius, shadows } = useTheme();
  const insets = useSafeAreaInsets();

  const [toast, setToast] = useState<ToastOptions | null>(null);
  const translateY = useRef(new Animated.Value(-100)).current;
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const hideToast = useCallback(() => {
    Animated.timing(translateY, {
      toValue: -120,
      duration: 250,
      useNativeDriver: true,
    }).start(() => {
      setToast(null);
    });
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, [translateY]);

  const showToast = useCallback(
    (options: ToastOptions | string) => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }

      const opts: ToastOptions =
        typeof options === 'string' ? { message: options, type: 'info' } : options;
      const type = opts.type || 'info';
      const duration = opts.duration || 3500;

      setToast({ ...opts, type });

      Animated.spring(translateY, {
        toValue: 0,
        useNativeDriver: true,
        bounciness: 4,
        speed: 12,
      }).start();

      timerRef.current = setTimeout(() => {
        hideToast();
      }, duration);
    },
    [hideToast, translateY]
  );

  const getToastColors = (type: ToastType = 'info') => {
    switch (type) {
      case 'success':
        return {
          bg: colors.successContainer,
          border: colors.success,
          icon: colors.success,
          iconName: 'checkmark-circle' as keyof typeof Ionicons.glyphMap,
          textColor: 'success' as const,
        };
      case 'danger':
        return {
          bg: colors.dangerContainer,
          border: colors.danger,
          icon: colors.danger,
          iconName: 'alert-circle' as keyof typeof Ionicons.glyphMap,
          textColor: 'danger' as const,
        };
      case 'warning':
        return {
          bg: colors.warningContainer,
          border: colors.warning,
          icon: colors.warning,
          iconName: 'warning' as keyof typeof Ionicons.glyphMap,
          textColor: 'warning' as const,
        };
      case 'info':
      default:
        return {
          bg: colors.infoContainer,
          border: colors.info,
          icon: colors.info,
          iconName: 'information-circle' as keyof typeof Ionicons.glyphMap,
          textColor: 'info' as const,
        };
    }
  };

  const toastStyle = toast ? getToastColors(toast.type) : null;

  return (
    <ToastContext.Provider value={{ showToast, hideToast }}>
      {children}
      {toast && toastStyle && (
        <Animated.View
          style={[
            styles.container,
            {
              top: Math.max(insets.top, 16),
              transform: [{ translateY }],
            },
          ]}
        >
          <View
            style={[
              styles.toastBox,
              {
                backgroundColor: colors.surfaceElevated,
                borderColor: toastStyle.border,
                borderLeftColor: toastStyle.border,
                borderLeftWidth: 4,
                borderRadius: borderRadius.md,
                padding: spacing.md,
                marginHorizontal: spacing.screenPadding,
              },
              shadows.md,
            ]}
          >
            <Ionicons
              name={toastStyle.iconName}
              size={20}
              color={toastStyle.icon}
              style={{ marginRight: spacing.sm }}
            />

            <View style={styles.textContainer}>
              <Text variant="bodySmall" color="primary" weight="600" numberOfLines={2}>
                {toast.message}
              </Text>
            </View>

            {toast.actionLabel && toast.onAction && (
              <TouchableOpacity
                onPress={() => {
                  toast.onAction?.();
                  hideToast();
                }}
                activeOpacity={0.7}
                style={{ marginLeft: spacing.sm, paddingHorizontal: 6 }}
              >
                <Text variant="buttonSmall" color={toastStyle.textColor} weight="700">
                  {toast.actionLabel}
                </Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              onPress={hideToast}
              activeOpacity={0.7}
              style={styles.closeBtn}
              accessibilityRole="button"
              accessibilityLabel="Dismiss notification"
            >
              <Ionicons name="close" size={16} color={colors.textMuted} />
            </TouchableOpacity>
          </View>
        </Animated.View>
      )}
    </ToastContext.Provider>
  );
};

export const useToast = (): ToastContextType => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    right: 0,
    zIndex: 9999,
  },
  toastBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
  },
  textContainer: {
    flex: 1,
  },
  closeBtn: {
    padding: 6,
    marginLeft: 6,
  },
});
