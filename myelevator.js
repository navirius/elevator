/*
 * Available information:
 * 1. Request queue
 * Simulator.get_instance().get_requests()
 * Array of integers representing floors where there are people calling the elevator
 * eg: [7,3,2] // There are 3 people waiting for the elevator at floor 7,3, and 2, in that order
 * 
 * 2. Elevator object
 * To get all elevators, Simulator.get_instance().get_building().get_elevator_system().get_elevators()
 * Array of Elevator objects.
 * - Current floor
 * elevator.at_floor()
 * Returns undefined if it is moving and returns the floor if it is waiting.
 * - Destination floor
 * elevator.get_destination_floor()
 * The floor the elevator is moving toward.
 * - Position
 * elevator.get_position()
 * Position of the elevator in y-axis. Not necessarily an integer.
 * - Elevator people
 * elevator.get_people()
 * Array of people inside the elevator
 * 
 * 3. Person object
 * - Floor
 * person.get_floor()
 * - Destination
 * person.get_destination_floor()
 * - Get time waiting for an elevator
 * person.get_wait_time_out_elevator()
 * - Get time waiting in an elevator
 * person.get_wait_time_in_elevator()
 * 
 * 4. Time counter
 * Simulator.get_instance().get_time_counter()
 * An integer increasing by 1 on every simulation iteration
 * 
 * 5. Building
 * Simulator.get_instance().get_building()
 * - Number of floors
 * building.get_num_floors()
 */

Elevator.prototype.decide = function() {
    var simulator = Simulator.get_instance();
    var building = simulator.get_building();
    var num_floors = building.get_num_floors();
    var elevators = Simulator.get_instance().get_building().get_elevator_system().get_elevators();
    var time_counter = simulator.get_time_counter();
    var requests = simulator.get_requests();
    
    var elevator = this;
    var people = this.get_people();
    var person = people.length > 0 ? people[0] : undefined;



    if(elevator) {
        elevator.at_floor();
        elevator.get_destination_floor();
        elevator.get_position();
    }


    if(person) {
        var personFloor=person.get_floor();
        var elevatorDirection=GetElevatorDirection(this);
        var elevatorDestFloor=elevator.get_destination_floor();
        var elevatorPosition=elevator.get_position();
        var peopleInsideElevator=people.length;
        //return this.commit_decision(person.get_destination_floor());


        if(elevatorDirection==Elevator.DIRECTION_UP){
            if(peopleInsideElevator==Config.elevator_capacity){
                var floor=GetFloorPeopleToDisembark(people,elevatorDestFloor,elevatorPosition, elevatorDirection);
                return this.commit_decision(floor);
            }
            else
             if(personFloor>=elevatorDestFloor){
                return this.commit_decision(elevatorDestFloor);
            }
            else if((personFloor<=elevatorDestFloor)&&(personFloor>=elevatorPosition)){
                return this.commit_descision(personFloor);
            }
        }
        else if(elevatorDirection==Elevator.DIRECTION_DOWN){
            if(personFloor<=elevatorDestFloor){
                return this.commit_decision(elevatorDestFloor);
            }
            else if((personFloor>=elevatorDestFloor)&&(personFloor>=elevatorPosition)){
                return this.commit_decision(personFloor);
            }
        }
    }

    for(var i = 0;i < requests.length;i++) {
        var handled = false;
        for(var j = 0;j < elevators.length;j++) {
            if(elevators[j].get_destination_floor() == requests[i]) {
                handled = true;
                break;
            }
        }
        if(!handled) {
            return this.commit_decision(requests[i]);
        }
    }

    return this.commit_decision(Math.floor(num_floors / 2));
};

function GetFloorPeopleToDisembark(people, elevatorDestFloor, elevatorPosition, elevatorDirection){
    var listFloor;
    listFloor=GetListRequestedFloor(people, elevatorDestFloor, elevatorPosition, elevatorDirection)
    listFloor=GetListRequestedFloor(people, elevatorDirection);
    return listFloor[0];
}

function GetListRequestedFloor(people, elevatorDestFloor, elevatorPosition, elevatorDirection){
    var countFloor=0;
    var listFloor;
    for(var i=0;0<people.length;i++){
        var person=people[i];
        if(elevatorDirection==Elevator.DIRECTION_UP){
            if((person.get_destination_floor()>=elevatorPosition)&&(person.get_destination_floor()<=elevatorDestFloor)){
                listFloor[countFloor]=person.get_destination_floor();
                countFloor++;
            }
        }
        else if(elevatorDirection==Elevator.DIRECTION_DOWN){
            if((person.get_destination_floor()<=elevatorPosition)&&(person.get_destination_floor()>=elevatorDestFloor)){
                listFloor[countFloor]=person.get_destination_floor();
                countFloor++;
            }
        }
    }

    return listFloor;
}
function ShortedListFloor(listFloor, elevatorDirection){
    //shorted
    if(elevatorDirection==Elevator.DIRECTION_UP){
        for(var i=0;0<listFloor.length;i++){
            if(i+1>listFloor.length)
                break;
            if(listFloor[i]>listFloor[i+1]){
                var tmp=listFloor[i];
                listFloor[i]=listFloor[i+1];
                listFloor[i+1]=tmp;
            }
        }
    }
    else if(elevatorDirection==Elevator.DIRECTION_DOWN){
        for(var i=0;0<listFloor.length;i++){
            if(i+1>listFloor.length)
                break;
            if(listFloor[i]<listFloor[i+1]){
                var tmp=listFloor[i];
                listFloor[i]=listFloor[i+1];
                listFloor[i+1]=tmp;
            }
        }
    }

    return listFloor;
}
function GetElevatorDirection(elevator){
    var elevator_direction;
    if(elevator.get_position() == ((elevator.get_destination_floor() - 1) * elevator.get_height())) {
        elevator_direction = Elevator.DIRECTION_STAY;
    } else if(elevator.get_position() < ((elevator.get_destination_floor() - 1) * elevator.get_height())) {
        elevator_direction = Elevator.DIRECTION_UP;
    } else if(elevator.get_position() > ((elevator.get_destination_floor() - 1) * elevator.get_height())) {
        elevator_direction = Elevator.DIRECTION_DOWN;
    }
}
