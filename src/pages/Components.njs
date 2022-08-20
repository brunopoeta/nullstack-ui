import Nullstack from 'nullstack';

// Components
import Button from '../components/Button/Button.njs';

export default class Components extends Nullstack {
    elements = [1, 2, 3, 4, 5, 6];
    isVisible = false;

    initiate(context) {
        context.darkMode = true;

        setTimeout(() => {
            context.darkMode = false;
        }, 5000);
    }

    handleClick() {
        this.isVisible = !this.isVisible;
    }

    // render() {
    //     return (
    //         <FormField>
    //             <span>Form Field</span>
    //         </FormField>
    //     )
    // }

    render() {
        return (
            <>
                <div p={5}>
                    <button
                        color={['secondary', 100]}>
                        Button
                    </button>

                    <button color="primary">
                        Primary button
                    </button>
                </div>

                <div
                    border="green"
                    outline={true}
                    outlineOffset={-15}
                    outlineWidth={5}
                    rounded={true}
                    p={5}>
                    Test
                </div>
            </>
            // <div
            //     alH="center"
            //     color="cyan"
            //     fat={true}
            //     flex={true}
            //     p={1}
            //     _hover={({ props }) => ({
            //         color: {
            //             darken: true,
            //             value: props.color
            //         }
            //     })}
            //     _down={{
            //         sm: {
            //             _hover: {
            //                 color: 'green'
            //             }
            //         }
            //     }}>
            //     Component
            // </div>
        )
    }
}

const FormField = ({ children }) => {
    return (
        <div bypass={true} color="blue">
            {children}
        </div>
    )
}