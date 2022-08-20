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
                    ellipsis={true}
                    font={{
                        family: 'body'
                    }}
                    fontSize={3}
                    noWrap={true}
                    w="half">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer at maximus lacus. Curabitur sit amet cursus purus. Pellentesque ac sem non mauris efficitur sodales et at lorem. Morbi sed accumsan neque, nec condimentum nulla. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Maecenas pulvinar sed urna et fermentum. Nam felis quam, congue vitae vulputate ultrices, molestie a dolor. Praesent posuere faucibus nibh quis fermentum. Nullam lectus nunc, sollicitudin non lorem vitae, vestibulum pellentesque nulla. In lorem nisl, gravida ut justo vel, ultrices tempor massa. Proin commodo neque ac nunc dignissim pellentesque. Integer posuere, mi sit amet dictum dapibus, nulla urna rutrum purus, faucibus viverra ex urna ut lacus.

                    Sed ultricies arcu vel tristique cursus. Nunc quis dolor id lectus pharetra accumsan. Fusce dictum nunc id mollis fringilla. Mauris nibh est, vulputate ut suscipit vitae, hendrerit vitae quam. Fusce luctus augue vitae ipsum dictum, vitae consectetur nulla hendrerit. Vivamus venenatis enim in metus aliquam scelerisque in eget libero. Sed in purus eget erat dictum fringilla eget vel erat. Phasellus tellus leo, bibendum at elementum venenatis, tempus auctor dui. Nulla sagittis viverra efficitur. Sed congue mauris eget neque rhoncus mattis. Nunc accumsan vulputate libero, et dictum augue tempor at. Vivamus at velit lectus.</div>

                <h2
                    font={{ family: 'body' }}
                    fontSize={2}
                    tracking="tighter"
                    semibold={true}>Test</h2>

                <p
                    clamp={3}
                    ov="hidden"
                    textColor="red">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer at maximus lacus. Curabitur sit amet cursus purus. Pellentesque ac sem non mauris efficitur sodales et at lorem. Morbi sed accumsan neque, nec condimentum nulla. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Maecenas pulvinar sed urna et fermentum. Nam felis quam, congue vitae vulputate ultrices, molestie a dolor. Praesent posuere faucibus nibh quis fermentum. Nullam lectus nunc, sollicitudin non lorem vitae, vestibulum pellentesque nulla. In lorem nisl, gravida ut justo vel, ultrices tempor massa. Proin commodo neque ac nunc dignissim pellentesque. Integer posuere, mi sit amet dictum dapibus, nulla urna rutrum purus, faucibus viverra ex urna ut lacus.
                </p>
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