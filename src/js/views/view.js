/*
 => This class is going to be a Parent class of all the view.
 => We export a class itself coz we r not going to create any instance of this view. We will only use it as a parent class of other child views.
 => With Parcel and Babel, inharitance between truely private fields and methods(with #) does not work yet. So here we have to use the the old  way of JS of protected methods and properties(using _ )
 */
export default class View {}
