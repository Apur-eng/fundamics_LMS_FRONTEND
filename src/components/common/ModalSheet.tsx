import React from 'react';
import {
  Modal,
  View,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useTheme } from '../../theme';
import { Text } from './Text';

export interface ModalSheetProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  style?: ViewStyle;
}

export const ModalSheet: React.FC<ModalSheetProps> = ({
  visible,
  onClose,
  title,
  subtitle,
  children,
  style,
}) => {
  const { colors, spacing, borderRadius, shadows } = useTheme();

  return (
    <Modal
      transparent
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={[styles.backdrop, { backgroundColor: colors.overlay }]}>
          <TouchableWithoutFeedback onPress={() => {}}>
            <KeyboardAvoidingView
              behavior={Platform.OS === 'ios' ? 'padding' : undefined}
              style={styles.keyboardView}
            >
              <View
                style={[
                  styles.sheetContainer,
                  {
                    backgroundColor: colors.surfaceElevated,
                    borderTopLeftRadius: borderRadius.xl,
                    borderTopRightRadius: borderRadius.xl,
                    padding: spacing.screenPadding,
                  },
                  shadows.lg,
                  style,
                ]}
              >
                {/* Drag Handle Indicator */}
                <View
                  style={[
                    styles.dragHandle,
                    {
                      backgroundColor: colors.border,
                      borderRadius: borderRadius.full,
                      marginBottom: spacing.md,
                    },
                  ]}
                />

                {/* Header Slot */}
                {title && (
                  <View style={{ marginBottom: spacing.md }}>
                    <Text variant="h3" color="primary">
                      {title}
                    </Text>
                    {subtitle && (
                      <Text variant="bodySmall" color="secondary" style={{ marginTop: 2 }}>
                        {subtitle}
                      </Text>
                    )}
                  </View>
                )}

                {/* Main Content */}
                {children}
              </View>
            </KeyboardAvoidingView>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  keyboardView: {
    width: '100%',
  },
  sheetContainer: {
    width: '100%',
    maxHeight: '85%',
  },
  dragHandle: {
    width: 40,
    height: 4,
    alignSelf: 'center',
  },
});
