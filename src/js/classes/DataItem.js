export default class DataItem {
    constructor(data) {
        this.data = data;
    }

    /**
     * The start function
     */
    init(index) {
        console.log('Data item mounted');
        this.create(index);
    }

    /**
     * Creates the DOM element for showing data
     */
    create(index) {
        // Containers
        let container = document.getElementById('data-container');

        // Wrapper
        let dataWrapper = document.createElement('div');
        dataWrapper.classList.add('data-wrapper');
        dataWrapper.setAttribute('id', `dataItem-${index}`);

        // Circle
        let dataCircle = document.createElement('div');
        dataCircle.classList.add('data-circle');
        dataWrapper.appendChild(dataCircle);
        
        // Title in circle
        let title = document.createElement('p');
        title.innerHTML = Math.round(this.data.value);
        title.classList.add('data-title');
        dataCircle.appendChild(title)

        // Subtitle beneath circle
        let subTitle = document.createElement('p');
        subTitle.innerHTML = this.data.key;
        dataWrapper.appendChild(subTitle);

        // Append to parent
        container.appendChild(dataWrapper);
    }
}