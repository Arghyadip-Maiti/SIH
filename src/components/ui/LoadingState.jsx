import { SkeletonPreloader } from './SkeletonPreloader';

export const LoadingState = ({ message = 'Loading MPLADS data...' }) => {
  return <SkeletonPreloader message={message} />;
};

export default LoadingState;
