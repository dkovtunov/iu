import {useRef, useState} from 'react';
import type {SubmitHandler} from 'react-hook-form';
import {useForm} from 'react-hook-form';
import styled from 'styled-components';
import {registerUser} from "../../../services/user.service.ts";

interface IFormState {
    email: string;
    password: string;
    name: string;
}

export const RegistrationForm = () => {
    const {
        register,
        formState: {
            errors,
            isDirty,
            // dirtyFields
        },
        handleSubmit,
        watch
    } = useForm<IFormState>({});

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [requestError, setRequestError] = useState<string | null>(null);
    const [requestSuccess, setRequestSuccess] = useState<boolean>(false);

    const password = useRef<string>("");
    password.current = watch('password', '');

    const onSubmit: SubmitHandler<IFormState> = async (data) => {
        if (!isDirty) {
            console.log("Form is empty");
            return;
        }

        setIsLoading(true);
        await registerUser(data.email, data.password, data.name)
            .then(() => setRequestSuccess(true))
            .catch((error) => {
                setRequestError(error.message + ": " + error.response.data.message)
            })
        setIsLoading(false);
    }

    return (
        <div>
            <h1>New account registration</h1>

            {requestSuccess && <RequestSuccess>
                <div>
                    Registration successful!
                </div>
                <div>
                    <button onClick={() => setRequestSuccess(false)}><small>Close</small></button>
                </div>
            </RequestSuccess>
            }
            {requestError && <RequestError>
                <div>
                    {requestError}
                </div>
                <div>
                    <button onClick={() => setRequestError(null)}><small>Close</small></button>
                </div>
            </RequestError>}

            <StyledForm onSubmit={handleSubmit(onSubmit)}>
                <StyledDiv>
                    <label>Name</label>
                    <input type='text' name='name' disabled={isLoading}/>
                </StyledDiv>

                <StyledDiv>
                    <label>Email<em>*</em></label>
                    <input
                        disabled={isLoading}
                        type='text'
                        {...(register(
                            'email',
                            {
                                required: 'You must specify an email',
                            }
                        ))}
                    />
                </StyledDiv>

                <StyledDiv>
                    <label>Password<em>*</em></label>
                    <input
                        type='password'
                        disabled={isLoading}
                        {...(register(
                            'password',
                            {
                                required: 'You must specify a password',
                                minLength: {
                                    value: 8,
                                    message: 'Password must have at least 8 characters'
                                }
                            }
                        ))}
                    />
                    {errors.password && <Error>{errors.password.message}</Error>}
                </StyledDiv>

                <StyledDiv>
                    <sup><em>*</em> Required fields</sup>
                </StyledDiv>

                <StyledDiv>
                    <button
                        type='submit'
                        disabled={isLoading}
                        onSubmit={handleSubmit(onSubmit)}>
                        Register
                    </button>
                </StyledDiv>

                {isLoading && <p>Loading...</p>}

            </StyledForm>
        </div>
    )
}

const Error = styled.form`
    color: red;
    font-size: 0.8em;
`

const StyledForm = styled.form`
    display: grid;
    justify-content: center;
`

const RequestSuccess = styled.div`
    background-color: #00b894;
    position: absolute;
    width: 200px;
    left: 50%;
    transform: translateX(-50%);
    top: 40%;
    padding: 30px;
    color: white;
    font-weight: bold;
`

const RequestError = styled.div`
    background-color: #f64f59;
    position: absolute;
    width: 200px;
    left: 50%;
    transform: translateX(-50%);
    top: 40%;
    padding: 30px;
    color: white;
    font-weight: bold;
`

const StyledDiv = styled.div`
    text-align: left;
    margin-top: 20px;
    padding: 3px;

    input {
        display: flex;
    }
`