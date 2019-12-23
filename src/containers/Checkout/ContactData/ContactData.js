import React , { Component } from 'react';
import {connect} from 'react-redux';
import Button from '../../../components/UI/Button/Button';
import classes from './ContactData.module.css';
import axios from '../../../axios-orders';
import Spinner from '../../../components/UI/Spinner/Spinner';
import Input from '../../../components/UI/Input/Input';
import withErrorHandler from '../../../hoc/withErrorHandler/withErrorHandler';
import * as actions from '../../../store/actions/index';
import {updateObject, checkValidity} from '../../../shared/utility';

class ContactData extends Component{
    state ={
        orderForm:{
            name: {
                elementType: 'input',
                elementConfig:{
                    type: 'text',
                    placeholder:'Your Name'
                },
                value:'',
                validation:{
                    required:true
                },
                valid:false,
                touched:false
            },
            street: {
                elementType: 'input',
                elementConfig:{
                    type: 'text',
                    placeholder:'Your Street'
                },
                value:'',
                validation:{
                    required:true
                },
                valid:false,
                touched:false
            },
            zipCode :{
                elementType: 'input',
                elementConfig:{
                    type: 'text',
                    placeholder:'Zip Code'
                },
                value:'',
                validation:{
                    required:true,
                    minLenght:5,
                    maxLength: 5
                },
                valid:false,
                touched:false
            },
            country: {
                elementType: 'input',
                elementConfig:{
                    type: 'text',
                    placeholder:'Country'
                },
                value:'',
                validation:{
                    required:true
                },
                valid:false,
                touched:false
            },
            email: {
                elementType: 'input',
                elementConfig:{
                    type: 'text',
                    placeholder:'Your Email'
                },
                value:'',
                validation:{
                    required:true,
                    isEmail: true
                },
                valid:false,
                touched:false
            },
            deliveryMethod :{
                elementType: 'select',
                elementConfig:{
                    options:[
                        {value:'fastest', displayValue:'Fastest'},
                        {value:'cheapest', displayValue:'Cheapest'}
                    ]
                },
                validation:{},
                value:'fastest',
                valid:true
            },
        },
        formIsValid: false
    }
    orderHandler=(event)=>{
        event.preventDefault();
        // this.setState({loading: true});
        const fromData = {}
        for(let formElementIdentifier in this.state.orderForm){
            fromData[formElementIdentifier]= this.state.orderForm[formElementIdentifier].value;
        }
        const order = {
            ingredients: this.props.ings,
            price: this.props.price,
            orderDate: fromData,
            userId: this.props.userId 
        }
        this.props.onOrderBurger(order, this.props.token);
    };
    inputChangedHandler=(event, inputIdentifier)=>{
        // console.log(event.target.value)
        
        const updatedFormElement = updateObject(this.state.orderForm[inputIdentifier],{
            value : event.target.value,
            valid : checkValidity(event.target.value, this.state.orderForm[inputIdentifier].validation),
            touched : true
        });
        const updateOrderForm = updateObject(this.state.orderForm,{
            [inputIdentifier] : updatedFormElement
        });


        let formIsValid= true;
        for(let inputIdentifier in updateOrderForm){
            formIsValid = updateOrderForm[inputIdentifier].valid && formIsValid
        }
        this.setState({orderForm: updateOrderForm, formIsValid: formIsValid});
    }
    render(){
        const fromElementArray = [];
        for(let key in this.state.orderForm){
            fromElementArray.push({
                id: key,
                config: this.state.orderForm[key]
            });
        }
        let form = (
            <form onSubmit={this.orderHandler}>
                {/* <Input elementType='...' elementConfig='...' value='...' /> */}
                {fromElementArray.map(formElement=>(
                    <Input key={formElement.id}
                        elementType={formElement.config.elementType}
                        elementConfig={formElement.config.elementConfig}
                        value={formElement.config.value}
                        invalid={!formElement.config.valid}
                        shouldValidate= {formElement.config.validation}
                        touched={formElement.config.touched}
                        changed={(event)=>this.inputChangedHandler(event, formElement.id)} />
                ))}
                <Button btnType='Success' disabled={!this.state.formIsValid} >ORDER</Button>
            </form>
        )
        if(this.props.loading){
            form= <Spinner/>
        }
        return(
            <div className={classes.ContactData}>
                <h4>Enter your contact information</h4>
                {form}
            </div>
        )
    }
}
const mapStateToProps = state=>{
    return {
        ings: state.burgerBuilder.ingredients,
        price: state.burgerBuilder.totalPrice,
        loading: state.order.loading,
        token: state.auth.token,
        userId: state.auth.userId
    }
}
const mapDispatchToProps = dispatch =>{
    return {
        onOrderBurger : (orderData, token)=>dispatch(actions.purchaseBurger(orderData, token))
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(ContactData, axios));