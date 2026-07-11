import './Button.css';

const Button = ({ variant = 'primary', size = 'medium', children, ...rest }) => {
  const className = `btn btn-${variant} btn-${size}`;

  return (
    <button className={className} {...rest}>
      {children}
    </button>
  );
};

export default Button;