import styles from './Button.module.css';

/**
 * @typedef {'primary' | 'secondary' | 'danger'} ButtonVariant
 * @typedef {'small' | 'medium' | 'large'} ButtonSize
 */

/**
 * @typedef {Object} ButtonProps
 * @property {ButtonVariant} [variant='primary'] - Visual style variant.
 * @property {ButtonSize} [size='medium'] - Button size.
 * @property {React.ReactNode} children - Button content.
 */

/**
 * Reusable Button component with multiple visual variants and sizes.
 * Supports all native HTML button attributes via rest props.
 *
 * @param {ButtonProps & React.ButtonHTMLAttributes<HTMLButtonElement>} props
 * @returns {JSX.Element} The rendered button element.
 *
 * @example
 * <Button variant="danger" size="large" onClick={handleDelete}>
 *   Delete
 * </Button>
 */
const Button = ({ variant = 'primary', size = 'medium', children, ...rest }) => {
  // Compose class names from CSS Module tokens.
  // Conditional join is used to avoid "undefined" in class list if props change.
  const className = [
    styles.btn,
    styles[`btn-${variant}`],
    styles[`btn-${size}`],
  ].join(' ');

  return (
    <button className={className} {...rest}>
      {children}
    </button>
  );
};

export default Button;