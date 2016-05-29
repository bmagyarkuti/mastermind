@extends('layouts.app')

@section('content')
    <div class="container">
        @if (count($guesses) > 0)

            <div class="panel panel-default">
                <div class="panel-heading">
                    Earlier Guesses
                </div>

                <div class="panel-body">
                    @foreach($guesses as $index => $guess)
                        <div class="row">
                            <label class="col-xs-1">#{{$index + 1}}</label>

                            @foreach($guess as $color)
                                <div class="col-xs-2">
                                    <div class="btn btn-{{$color}} disabled btn-block">
                                    {{$color}}
                                    </div>
                                </div>
                            @endforeach

                            <div class="col-xs-offset-1 col-xs-2">
                                <div class="row gutter-10">
                                    <div class=" col-xs-3">
                                        <div class ="btn btn-{{$evals[$index][0]}} disabled btn-xs btn-block">x</div>
                                    </div>
                                    <div class=" col-xs-3">
                                        <div class ="btn btn-{{$evals[$index][1]}} disabled btn-xs btn-block">x</div>
                                    </div>
                                </div>
                                <div class="row gutter-10">
                                    <div class=" col-xs-3">
                                        <div class ="btn btn-{{$evals[$index][2]}} disabled btn-xs btn-block">x</div>
                                    </div>
                                    <div class="col-xs-3">
                                        <div class ="btn btn-{{$evals[$index][3]}} disabled btn-xs btn-block">x</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    @endforeach
                </div>
            </div>
        @endif

        @if (!$isGameOver)
            <div class="panel panel-default">
                <div class="panel-heading">
                    New Guess
                </div>

                <div class="panel-body">
                    @include('common.errors')

                    <form action="{{url('/step')}}" method="POST" class="form-horizontal">
                    {{ csrf_field() }}

                            <div class="row">
                                <div class="form-group">
                                    <label class="col-sm-1 control-label">#{{count($guesses) + 1}}</label>

                                    @for($i = 1; $i <= 4; $i++)
                                    <div class="col-sm-2">
                                        <select name="color{{$i}}" title="" class="selectpicker form-control" id="{{$i}}" data-style="green">
                                            <option disabled selected value>Color...</option>
                                            @foreach($colors as $color)
                                                <option class="{{$color}}">{{$color}}</option>
                                            @endforeach
                                        </select>
                                    </div>
                                    @endfor

                                <!-- Add Task Button -->
                                    <div class="col-xs-3">
                                        <button type="submit" class="btn btn-default">
                                            <i class="fa fa-btn fa-plus"></i>Send Guess
                                        </button>
                                    </div>
                                </div>
                            </div>
                    </form>
                </div>
            </div>
        @elseif($isGameOver)
            @if ($isWon)
                <div class="panel-body">
                    <div class="jumbotron">
                        <h1>
                            Congratulations, you cracked the code.
                        </h1>
                        @if(\Auth::check())
                            <h2>
                                Here's how your result compares against your own record.
                            </h2>
                            <p>
                                You took <strong>{{count($guesses)}}</strong> steps to crack
                                the code.
                                @if($stats['count'] > 1)
                                    Usually, this takes <strong>{{$stats['the_stats']->average}} steps.</strong>
                                    The longest it ever took you to win was <strong>{{$stats['the_stats']->worst}}</strong>
                                    steps. Your best win took <strong>{{$stats['the_stats']->best}}</strong> steps.
                                @endif
                            </p>
                        @endif
            @else
                        <h1>
                        Nope, that's still not it. However, your lives ran out.
                        </h1>

                        <div class="row">
                            <div class="col-xs-3">
                                <p>The correct pattern was:</p>
                            </div>
                            @foreach($codePattern as $color)
                                <div class="col-xs-2">

                                    <div class="btn btn-{{$color}} disabled btn-block">
                                        {{$color}}
                                    </div>
                                </div>
                            @endforeach
                        </div>
            @endif
                    </div>
                </div>
        @endif
    </div>
@endsection