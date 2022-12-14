/**
 * @jest-environment jsdom
 */

 import {screen, waitFor , fireEvent,  } from "@testing-library/dom"
 import BillsUI from "../views/BillsUI.js"
 import Bills from "../containers/Bills.js"
 import { bills } from "../fixtures/bills.js"
 import { ROUTES_PATH, ROUTES} from "../constants/routes.js";
 import {localStorageMock} from "../__mocks__/localStorage.js"

 import  mockedBills from "../__mocks__/store.js";


//function antiChrono
/*import antiChrono  from "../app/format.js"*/

 import router from "../app/Router.js";
 
 describe("Given I am connected as an employee", () => {
   describe("When I am on Bills Page", () => {
     test("Then bill icon in vertical layout should be highlighted", async () => {
 
       Object.defineProperty(window, 'localStorage', { value: localStorageMock })
       window.localStorage.setItem('user', JSON.stringify({
         type: 'Employee'
       }))
       const root = document.createElement("div")
       root.setAttribute("id", "root")
       document.body.append(root)

       // redirecteur des  Urls vers = > pages 
       router()
       window.onNavigate(ROUTES_PATH.Bills)
       await waitFor(() => screen.getByTestId('icon-window'))
       const windowIcon = screen.getByTestId('icon-window')
       //to-do write expect expression
       expect(windowIcon.classList.contains('active-icon')).toBe(true);
 
     })

     test("Then message icon in vertical layout should be not highlighted", async () => {

      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
      }))
      const root = document.createElement("div")
      root.setAttribute("id", "root")
      document.body.append(root)
      router()
      window.onNavigate(ROUTES_PATH.Bills)
      await waitFor(() => screen.getByTestId('icon-mail'))
      const windowIcon = screen.getByTestId('icon-mail')
      expect(windowIcon.classList.contains('active-icon')).not.toBe(true)
    })
    
     test("Then bills should be ordered from earliest to latest", () => {
      document.body.innerHTML = BillsUI({ data: bills })
      const dates = screen.getAllByText(/^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/i).map(a => a.innerHTML)

      const antiChrono = (a, b) => ((a < b) ? 1 : -1)
    
      const datesSorted = [...dates].sort(antiChrono)


      expect(dates).toEqual(datesSorted)
       
     })
   })

 
 
 /*********************   test-icon-eye*/

 
   test('then a modal should open', () => {
    // create the context
    document.body.innerHTML = BillsUI({data: bills})
    const onNavigate = (pathname) => {document.body.innerHTML = ROUTES({pathname})}

    // create New Bills
    const bill = new Bills({
      document, 
      onNavigate,
      store: null,
      localStorage: window.localStorage
    })

    $.fn.modal = jest.fn()
    const button = screen.getAllByTestId('icon-eye')[0]
    const handleClickIconEye = jest.fn((e) => {
      e.preventDefault()
      bill.handleClickIconEye(button)
    })

    button.addEventListener('click', handleClickIconEye)
    fireEvent.click(button)
    expect(handleClickIconEye).toHaveBeenCalled()
  })

   
 })   
 

 // check handleClickIconEye methode

/* describe('When Im on a bill & I click on the icon eye', () => {
  test('Then A modal should open', () => {
    // set localstorage to mockstorage & user to employee
    Object.defineProperty(window, 'localStorage', { value: localStorageMock })
    window.localStorage.setItem('user', JSON.stringify({type: 'Employee'}))
    const onNavigate = (pathname) => {
      document.body.innerHTML = ROUTES({ pathname })
    }
    // place UI in DOM
    const html = BillsUI({ data: bills })
    document.body.innerHTML = html

   // declare firestore
    const mockedBills = null
    // define bills
    const billItem = new Bills({
      document, onNavigate, mockedBills, localStorage: window.localStorage
    })
    // mock bootstrap modal function (see P9 sources folder)
    $.fn.modal = jest.fn()
    // mock methode handleClickIconEye 
    const handleClickIconEye = jest.fn(billItem.handleClickIconEye)
    // find eye icon buttons in DOM
    const iconEye = screen.getAllByTestId('icon-eye')
    // add event listeners to eye icons
    iconEye.forEach((icon) => { 
      icon.addEventListener('click', (e) => handleClickIconEye(icon))
    // mimic user interaction
    fireEvent.click(icon)
    })
    // check methode is called
    expect(handleClickIconEye).toHaveBeenCalled()
    // check Modal opened by searching for its ID
    const modale = document.getElementById('modaleFile')
    expect(modale).toBeTruthy()
  })
})
*/
 
 /********************* */

    //Test handleClickNewBill for container/Bills.js  
    //test cliquer sur le botton Nouvelle note de frais

 describe("when i am on Bills Page and i click on new Bill Button",()=>{
  test("Then form new bill should be open",()=>{

      // Init onNavigate
      const onNavigate=(pathname)=>{
        document.body.innerHTML=ROUTES({pathname})
      }

    // LocalStorage - Employee
      Object.defineProperty(window,'localStorage',{value:localStorageMock})
      window.localStorage.setItem('user',JSON.stringify({
        type:'Employee'
      }))


      //vider la page
      const bills = new Bills({
        document,
        onNavigate,
        StoreAll :null,
        localStorage:window.localStorage
      })

       //instancier la classe Bills
      const html=BillsUI({data:bills})
      document.body.innerHTML=html

       //Get button New bill
      const buttonNewBill=screen.getByTestId('btn-new-bill')
       //Mock handleClickNewBill (pointer)
      const handleClickNewBill=jest.fn((e)=>bills.handleClickNewBill(e))
      //Attach event to btnBill
      buttonNewBill.addEventListener('click',handleClickNewBill)
      //lanch click
      fireEvent.click(buttonNewBill)

     // expect(handleClickNewBill).toHaveBeenCalled()

        //La note de frais doit ??tre envoy??e
        expect(screen.getAllByText('Envoyer une note de frais')).toBeTruthy();
        //Le formulaire Nouvelle note des frais doit ??tre affich??
        expect(screen.getByTestId('form-new-bill')).not.toBe(null); 

  })

  
})
    // next two tests basically the same as on dashboard tests
    // replace DashboardUI for BillsUI

    describe('When I am on Bills page but it is loading', () => {
      test('Then, Loading page should be rendered', () => {
        const html = BillsUI({ loading: true })
        document.body.innerHTML = html
        expect(screen.getAllByText('Loading...')).toBeTruthy()
      })
    })
    describe('When I am on Bills page but back-end send an error message', () => {
      test('Then, Error page should be rendered', () => {
        const html = BillsUI({ error: 'some error message' })
        document.body.innerHTML = html
        expect(screen.getAllByText('Erreur')).toBeTruthy()
      })
    })

  
 /********************* */


// test d'int??gration de recup??ration des Bills avec GET 
describe("Given I am a user connected as Employee", () => {
  describe("When I navigate to Bills UI", () => {
    test("then  API GET fetches (r??cupere) 4 bills", async () => {
      const getSpy = jest.spyOn(mockedBills, "bills");

      // Get bills and the new bill
      const bills = await mockedBills.bills().list();

      // getSpy must have been called once
      expect(getSpy).toHaveBeenCalledTimes(1);
      // The number of bills must be 4
      expect(bills.length).toBe(4);
    });

    test("then should API return 404 message error when it doesn't fetches bills", async () => {
      //simulation d'erreur 404(page introuvable)
      mockedBills.bills.mockImplementationOnce(() =>
        Promise.reject(new Error("Erreur 404"))
      );

      // user interface creation with error code
      const html = BillsUI({
        error: "Erreur 404"
      });
      document.body.innerHTML = html;

      const message = await screen.getByText(/Erreur 404/);
      // wait for the error message 404
      expect(message).toBeTruthy();
    });

    test("fetches messages from an API and fails with 500 message error", async () => {
      mockedBills.bills.mockImplementationOnce(() =>
        Promise.reject(new Error("Erreur 500"))
      );

      // user interface creation with error code
      const html = BillsUI({
        error: "Erreur 500"
      });
      document.body.innerHTML = html;

      const message = await screen.getByText(/Erreur 500/);
      // wait for the error message 500
      expect(message).toBeTruthy();
    });
  });
});
