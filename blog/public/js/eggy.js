/*!
 * Eggy JS 1.0.0
*/

class Builder {

    //Constructor
    constructor(userOptions){
        //Build our default options
        this.options = {
            ...this.buildDefaultOptions(userOptions),
            ...userOptions
        };
    }


    /**
     * Create a new toast
     * 
     * @return {Promise}
    */
    async create(){
        //Add our styling
        await Promise.all([
            this.addStyling(),
            this.addTheme()
        ]);
        //Build it
        let toast = await this.build();
        //Toast bindings
        await this.bindings(toast);
        //Once its buil, open it after a split second
        setTimeout(() => {
            toast.classList.add('open');
        }, 250);
        //Wait the specified time in the options then close it
        setTimeout(() => {
            this.destroyToast(toast);
        }, this.options.duration);
        //Done
        return toast;
    }


    /**
     * Build the popup
     * 
     * @return {Promise} HTMLElement The new toast
    */
    async build(){
        //Create one
        let wrapper = await this.createWrapper();
        //Create the toast
        let toast = await this.createToast();
        //Put the toast in the wrapper
        wrapper.appendChild(toast);
        //Resolve
        return toast;
    }


    /**
     * Create the toast element
     * 
     * @return {Promise} 
    */
    async createToast(){
        //Create the element
        let toast = document.createElement('div'),
            innerWrapper = document.createElement('div');
        //Generate a random toast id
        toast.setAttribute('id', 'eggy-'+Math.random().toString(36).substr(2, 4));
        //Set toast attributes
        toast.classList.add(this.options.type);
        //Are we adding a title?
        if(this.options.title){
            let title = document.createElement('p');
            title.classList.add('title');
            title.innerHTML = this.options.title;
            innerWrapper.appendChild(title);
        }
        //Are we adding a message?
        if(this.options.message){
            let message = document.createElement('p');
            message.classList.add('message');
            message.innerHTML = this.options.message;
            innerWrapper.appendChild(message);
        }
        //Append the icon, inner wrapper and close btn to the toast
        toast.innerHTML = await this.getIconContent();
        toast.appendChild(innerWrapper);
        toast.innerHTML += await this.getCloseBtnContent();
        //Are we adding a progress bar?
        if(this.options.progressBar){
            toast = this.addProgressBarToToast(toast);
        }
        //Return it
        return toast;
    }


    /**
     * Destroy the toast, remove it!
     * 
     * @param {HTMLElement} toast - The toast element we're removing
     * @return {Promise}
    */
    async destroyToast(toast){
        //Add the closing class for smooth closing
        toast.classList.add('closing');
        //After 200ms (the length of the css animation plus a bit), remove it
        setTimeout(() => {
            toast.remove();
        }, 450);
    }


    /**
     * Add all of the bindings for the toast
     * 
     * @param {HTMLElement} toast - The toast we're building the bindings for
     * @return {Promise}
    */
    async bindings(toast) {
        // Check if toast exists and query the element only if it does
        if (toast) {
            let closeButton = toast.querySelector('.close-btn');
            if (closeButton) {
                closeButton.addEventListener('click', async () => {
                    this.destroyToast(toast);
                });
            }
        }
    }
    
    
    /**
     * Create the element that the toasts are wrapped in
     * 
     * @return {Promise} The wrapper HTML Element
    */
    async createWrapper(){
        //Return an existing wrapper if it exists
        let wrapper = await this.isAlreadyOpen();
        if(!wrapper){
            //Create the element
            wrapper = document.createElement('div');
            //Set its attributes
            wrapper.classList.add('eggy', this.options.position);
            //Append it to the page and return it
            document.querySelector('body').appendChild(wrapper);
        }
        //Return it
        return wrapper;
    }


    /**
     * Check if there is already a toast initialised in the specified position
     * 
     * @return {Promise} The wrapper if it exists, false if it doesnt
    */
    async isAlreadyOpen(){
        //Get the wrapper
        let wrapper = document.querySelector(`.eggy.${this.options.position}`);
        return (wrapper ? wrapper : false);
    }
    

    /**
     * Get the icons content
     * 
     * @return {Promise}
    */
    async getIconContent(){
        //Switch the type
        switch(this.options.type){
            case 'success':
                return '<svg viewBox="0 0 24 24" fill="none"><g id="icon/alert/warning_24px"><path id="icon/alert/warning_24px_2" fill-rule="evenodd" clip-rule="evenodd" d="M19.53 20.5037C21.07 20.5037 22.03 18.8337 21.26 17.5037L13.73 4.49374C12.96 3.16375 11.04 3.16375 10.27 4.49374L2.74001 17.5037C1.96999 18.8337 2.93001 20.5037 4.46999 20.5037H19.53ZM12 13.5037C11.45 13.5037 11 13.0537 11 12.5037V10.5037C11 9.95376 11.45 9.50375 12 9.50375C12.55 9.50375 13 9.95376 13 10.5037V12.5037C13 13.0537 12.55 13.5037 12 13.5037ZM11 15.5037V17.5037H13V15.5037H11Z"></path></g></svg>';
            break;
            case 'info':
                return '<svg width="24" height="24" viewBox="0 0 24 24" fill="none"><g id="icon/action/info_24px"><path id="icon/action/info_24px_2" fill-rule="evenodd" clip-rule="evenodd" d="M12 2C6.47998 2 2 6.48 2 12C2 17.52 6.47998 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 17C11.45 17 11 16.55 11 16V12C11 11.45 11.45 11 12 11C12.55 11 13 11.45 13 12V16C13 16.55 12.55 17 12 17ZM11 7V9H13V7H11Z"></path></g></svg>';
            break;
            case 'warning':
                return '<svg viewBox="0 0 24 24" fill="none"><g id="icon/alert/warning_24px"><path id="icon/alert/warning_24px_2" fill-rule="evenodd" clip-rule="evenodd" d="M19.53 20.5037C21.07 20.5037 22.03 18.8337 21.26 17.5037L13.73 4.49374C12.96 3.16375 11.04 3.16375 10.27 4.49374L2.74001 17.5037C1.96999 18.8337 2.93001 20.5037 4.46999 20.5037H19.53ZM12 13.5037C11.45 13.5037 11 13.0537 11 12.5037V10.5037C11 9.95376 11.45 9.50375 12 9.50375C12.55 9.50375 13 9.95376 13 10.5037V12.5037C13 13.0537 12.55 13.5037 12 13.5037ZM11 15.5037V17.5037H13V15.5037H11Z"></path></g></svg>';
            break;
            case 'error':
                return '<svg viewBox="0 0 24 24" fill="none"><g id="icon/alert/error_24px"><path id="icon/alert/error_24px_2" fill-rule="evenodd" clip-rule="evenodd" d="M12 2C6.47998 2 2 6.48001 2 12C2 17.52 6.47998 22 12 22C17.52 22 22 17.52 22 12C22 6.48001 17.52 2 12 2ZM12 13C11.45 13 11 12.55 11 12V8C11 7.45001 11.45 7 12 7C12.55 7 13 7.45001 13 8V12C13 12.55 12.55 13 12 13ZM11 15V17H13V15H11Z"></path></g></svg>';
            break;
        }
    }


    /**
     * Get the close content
     * 
     * @return {Promise}
    */
    async getCloseBtnContent(){
        return '<svg class="close-btn" viewBox="0 0 24 24" fill="none"><g id="icon/navigation/close_24px"><path id="icon/navigation/close_24px_2" d="M18.3 5.70999C18.1131 5.52273 17.8595 5.4175 17.595 5.4175C17.3305 5.4175 17.0768 5.52273 16.89 5.70999L12 10.59L7.10997 5.69999C6.92314 5.51273 6.66949 5.4075 6.40497 5.4075C6.14045 5.4075 5.8868 5.51273 5.69997 5.69999C5.30997 6.08999 5.30997 6.71999 5.69997 7.10999L10.59 12L5.69997 16.89C5.30997 17.28 5.30997 17.91 5.69997 18.3C6.08997 18.69 6.71997 18.69 7.10997 18.3L12 13.41L16.89 18.3C17.28 18.69 17.91 18.69 18.3 18.3C18.69 17.91 18.69 17.28 18.3 16.89L13.41 12L18.3 7.10999C18.68 6.72999 18.68 6.08999 18.3 5.70999Z"></path></g></svg>';
    }


    /**
     * Add the mandatory styling to the page
     * 
     * @return {Promise}
    */
    async addStyling(){
        //If there is no page styling already
        if(!document.querySelector('.eggy-styles')){
            //Create the style tag
            let styles = document.createElement('style');
            //Add a class
            styles.classList.add('eggy-styles');
            //Populate it
            styles.innerHTML = '{{CSS_STYLES}}';
            //Add to the head
            document.querySelector('head').appendChild(styles);
        }
        //Resolve
        return;
    }


    /**
     * Add the theme styling to the page
    */
    async addTheme(){
        //If there is no page styling already
        if(!document.querySelector('.eggy-theme') && this.options.styles){
            //Create the style tag
            let styles = document.createElement('style');
            //Add a class
            styles.classList.add('eggy-theme');
            //Populate it
            styles.innerHTML = '{{CSS_THEME}}';
            //Add to the head
            document.querySelector('head').appendChild(styles);
        }
        //Resolve
        return;
    }


    /**
     * Add a progress bar to a toast
     * 
     * @param {HTMLElement} toast - Toast we're adding a progress bar to
     * @return {Promise}
    */
    async addProgressBarToToast(toast){
        //Build our HTML
        let progressBar = document.createElement('span');
        //Get the duration
        let duration = this.options.duration / 1000;
        //Add our classes
        progressBar.classList.add('progress-bar');
        toast.appendChild(progressBar);
        //Add our styles
        if(this.options.styles){
            //Get the toasts id
            let toast_id = toast.getAttribute('id'),
                progressBarStyles = document.createElement('style');
            //Build the content
            progressBarStyles.innerHTML = `{{CSS_PROGRESS_BAR}}`;
            progressBarStyles.innerHTML += `#${toast_id} > .progress-bar { animation-duration: ${duration}s }`;
            toast.appendChild(progressBarStyles);
        }
        //Append it to the toast
        //Return the toast
        return toast;
    }


    /**
     * Build the default options
     * 
     * @param {Object} userOptions The user options for any overwrites
     * @return {Object} An object of options
    */
    buildDefaultOptions(userOptions){
        let options = {
            position: 'top-right',
            type: 'success',
            styles: true,
            duration: 5000,
            progressBar: true
        }
        //Get our type
        let type = (userOptions != undefined) ? userOptions.type ?? options.type : options.type;
        switch(type){
            case 'success':
                //Default titles and messages if not set in user options
                options.title = 'Success!';
                options.message = 'Task successfully completed.';
            break;
            case 'info':
                //Default titles and messages if not set in user options
                options.title = 'Information';
                options.message = 'Please take note of this information.';
            break;
            case 'warning':
                //Default titles and messages if not set in user options
                options.title = 'Warning';
                options.message = 'Please be careful!';
            break;
            case 'error':
                //Default titles and messages if not set in user options
                options.title = 'Whoops!';
                options.message = 'Something wen\'t wrong, please try again!';
            break;
        }
        //Return
        return options;
    }

}

//Export the Eggy function for use
export function Eggy(options) {
    return new Promise(async (resolve, reject) => {
        try {
            let newBuild = new Builder(options);
            let toast = await newBuild.create();
            resolve(toast);
        } catch (error) {
            reject(error);
        }
    });
}