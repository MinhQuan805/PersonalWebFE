interface AlertState {
  message: string | null;
  type: 'success' | 'error' | 'warning' | null;
  visible: boolean;
}

const initialState: AlertState = {
  message: null,
  type: null,
  visible: false,
};

const alertReducer = (state = initialState, action: any): AlertState => {
  switch (action.type) {
    case 'success':
    case 'error':
      return {
        message: action.message,
        type: action.type,
        visible: true,
      };
    case 'hide':
      return {
        ...state,
        visible: false,
      };
    default:
      return state;
  }
};

export default alertReducer;
